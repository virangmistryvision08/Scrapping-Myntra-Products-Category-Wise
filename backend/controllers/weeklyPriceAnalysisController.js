// const PriceHistory = require("../models/priceHistoryModel");

// const SORT_MODE_CONFIG = {
//   // TITLE
//   TITLE_AZ: { field: "product.title", order: 1, caseSensitive: false },
//   TITLE_ZA: { field: "product.title", order: -1, caseSensitive: false },
//   TITLE_az: { field: "product.title", order: 1, caseSensitive: true },
//   TITLE_za: { field: "product.title", order: -1, caseSensitive: true },

//   // BRAND
//   BRAND_AZ: { field: "product.brand", order: 1, caseSensitive: false },
//   BRAND_ZA: { field: "product.brand", order: -1, caseSensitive: false },
//   BRAND_az: { field: "product.brand", order: 1, caseSensitive: true },
//   BRAND_za: { field: "product.brand", order: -1, caseSensitive: true },
// };

// const weeklyPriceAnalysis = async (req, res) => {
//   try {
//     const {
//       sortMode = "TITLE_AZ", // 🔥 default
//       sortBy, // numeric field
//       order = "desc",
//       trend,
//     } = req.query;

//     const sortConfig = SORT_MODE_CONFIG[sortMode];

//     if (!sortConfig) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid sortMode",
//       });
//     }

//     const pipeline = [
//       /* 1️⃣ Historical ordering */
//       { $sort: { scrape_date: 1 } },

//       /* 2️⃣ Group per product */
//       {
//         $group: {
//           _id: "$product_id",
//           oldPrice: { $first: "$original_price" },
//           latestPrice: { $last: "$original_price" },
//           oldDate: { $first: "$scrape_date" },
//           latestDate: { $last: "$scrape_date" },
//         },
//       },

//       /* 3️⃣ Join product */
//       {
//         $lookup: {
//           from: "products",
//           localField: "_id",
//           foreignField: "_id",
//           as: "product",
//         },
//       },
//       { $unwind: "$product" },

//       /* 4️⃣ Compute analytics */
//       {
//         $addFields: {
//           priceChange: { $subtract: ["$latestPrice", "$oldPrice"] },

//           percentChange: {
//             $cond: [
//               { $gt: ["$oldPrice", 0] },
//               {
//                 $round: [
//                   {
//                     $multiply: [
//                       {
//                         $divide: [
//                           { $subtract: ["$latestPrice", "$oldPrice"] },
//                           "$oldPrice",
//                         ],
//                       },
//                       100,
//                     ],
//                   },
//                   2,
//                 ],
//               },
//               0,
//             ],
//           },

//           trend: {
//             $cond: [
//               { $gt: ["$latestPrice", "$oldPrice"] },
//               "INCREASED",
//               {
//                 $cond: [
//                   { $lt: ["$latestPrice", "$oldPrice"] },
//                   "DECREASED",
//                   "NO_CHANGE",
//                 ],
//               },
//             ],
//           },
//         },
//       },
//     ];

//     /* 🔥 Trend filter */
//     if (trend) {
//       pipeline.push({ $match: { trend } });
//     }

//     /* 🔥 Sort stage */
//     pipeline.push({
//       $sort: {
//         [sortConfig.field]: sortConfig.order,
//       },
//     });

//     /* 🔥 Projection */
//     pipeline.push({
//       $project: {
//         _id: 0,
//         productId: "$_id",
//         title: "$product.title",
//         brand: "$product.brand",
//         rating: "$product.rating",
//         product_url: "$product.product_url",
//         oldPrice: 1,
//         latestPrice: 1,
//         priceChange: 1,
//         percentChange: 1,
//         trend: 1,
//       },
//     });

//     /* 🔥 Collation */
//     const report = await PriceHistory.aggregate(pipeline).collation({
//       locale: "en",
//       strength: sortConfig.caseSensitive ? 3 : 2,
//     });

//     res.json({
//       status: true,
//       total: report.length,
//       sortMode,
//       trendFilter: trend || "ALL",
//       data: report,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: false,
//       message: err.message,
//     });
//   }
// };

// module.exports = { weeklyPriceAnalysis };

















const PriceHistory = require("../models/priceHistoryModel");

/* ---------------- STRING SORT CONFIG ---------------- */
const SORT_MODE_CONFIG = {
  TITLE_AZ: { field: "product.title", order: 1 },
  TITLE_ZA: { field: "product.title", order: -1 },
  BRAND_AZ: { field: "product.brand", order: 1 },
  BRAND_ZA: { field: "product.brand", order: -1 },
};

/* ---------------- NUMERIC SORT FIELDS ---------------- */
const NUMERIC_FIELDS = [
  "oldPrice",
  "latestPrice",
  "priceChange",
  "percentChange",
];

const weeklyPriceAnalysis = async (req, res) => {
  try {
    const {
      sortMode = "TITLE_AZ",
      sortBy = "",
      order = "desc",
      trend,
    } = req.query;

    const pipeline = [
      { $sort: { scrape_date: 1 } },

      {
        $group: {
          _id: "$product_id",
          oldPrice: { $first: "$original_price" },
          latestPrice: { $last: "$original_price" },
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      {
        $addFields: {
          priceChange: { $subtract: ["$latestPrice", "$oldPrice"] },
          percentChange: {
            $cond: [
              { $gt: ["$oldPrice", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: ["$latestPrice", "$oldPrice"] },
                          "$oldPrice",
                        ],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
              0,
            ],
          },
          trend: {
            $cond: [
              { $gt: ["$latestPrice", "$oldPrice"] },
              "INCREASED",
              {
                $cond: [
                  { $lt: ["$latestPrice", "$oldPrice"] },
                  "DECREASED",
                  "NO_CHANGE",
                ],
              },
            ],
          },
        },
      },
    ];

    if (trend) pipeline.push({ $match: { trend } });

    let sortStage = { priceChange: -1 };

    if (NUMERIC_FIELDS.includes(sortBy)) {
      sortStage = { [sortBy]: order === "asc" ? 1 : -1 };
    } else if (SORT_MODE_CONFIG[sortMode]) {
      sortStage = {
        [SORT_MODE_CONFIG[sortMode].field]:
          SORT_MODE_CONFIG[sortMode].order,
      };
    }

    pipeline.push({ $sort: sortStage });

    pipeline.push({
      $project: {
        _id: 0,
        productId: "$_id",
        title: "$product.title",
        brand: "$product.brand",
        oldPrice: 1,
        latestPrice: 1,
        priceChange: 1,
        percentChange: 1,
        trend: 1,
      },
    });

    const report = await PriceHistory.aggregate(pipeline).collation({
      locale: "en",
      strength: 2,
    });

    res.json({ status: true, data: report });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = { weeklyPriceAnalysis };
