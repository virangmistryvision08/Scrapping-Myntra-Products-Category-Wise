const PriceHistory = require("../models/priceHistoryModel");

const weeklyPriceAnalysis = async (req, res) => {
  try {
    const {
      sortBy = "priceChange",
      order = "desc",
      trend,
    } = req.query;

    const sortOrder = order === "asc" ? 1 : -1;

    const pipeline = [
      { $sort: { scrape_date: 1 } },
      {
        $group: {
          _id: "$product_id",
          oldPrice: { $first: "$original_price" },
          latestPrice: { $last: "$original_price" },
          oldDate: { $first: "$scrape_date" },
          latestDate: { $last: "$scrape_date" },
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

          trendOrder: {
            $switch: {
              branches: [
                { case: { $gt: ["$latestPrice", "$oldPrice"] }, then: 1 },
                { case: { $lt: ["$latestPrice", "$oldPrice"] }, then: 2 },
              ],
              default: 3,
            },
          },
        },
      },
    ];
    if (trend) {
      pipeline.push({
        $match: { trend },
      });
    }
    pipeline.push({
      $sort:
        sortBy === "trend"
          ? { trendOrder: sortOrder }
          : { [sortBy]: sortOrder },
    });
    pipeline.push({
      $project: {
        _id: 0,
        productId: "$_id",
        title: "$product.title",
        brand: "$product.brand",
        rating: "$product.rating",
        product_url: "$product.product_url",
        oldPrice: 1,
        latestPrice: 1,
        priceChange: 1,
        percentChange: 1,
        trend: 1,
      },
    });

    const report = await PriceHistory.aggregate(pipeline).collation({ locale: "en", strength: 2 });

    res.json({
      status: true,
      total: report.length,
      sortBy,
      order,
      trendFilter: trend || "ALL",
      data: report,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = { weeklyPriceAnalysis };
