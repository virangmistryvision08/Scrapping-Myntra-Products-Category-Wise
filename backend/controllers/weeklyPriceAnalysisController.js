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
