const PriceHistory = require("../models/priceHistoryModel");

const weeklyPriceAnalysis = async (req, res) => {
  try {
    const report = await PriceHistory.aggregate([
      // 1️⃣ Sort so first = old price, last = latest price
      { $sort: { scrape_date: 1 } },

      // 2️⃣ Group by product
      {
        $group: {
          _id: "$product_id",
          oldPrice: { $first: "$price" },
          latestPrice: { $last: "$original_price" },
          oldDate: { $first: "$scrape_date" },
          latestDate: { $last: "$scrape_date" },
        },
      },

      // 3️⃣ Join Product collection
      {
        $lookup: {
          from: "products",      // collection name (lowercase + plural)
          localField: "_id",     // product_id
          foreignField: "_id",   // Product _id
          as: "product",
        },
      },

      // 4️⃣ Convert product array → object
      { $unwind: "$product" },

      // 5️⃣ Final response structure
      {
        $project: {
          _id: 0,
          productId: "$_id",

          // 🧾 Product details
          title: "$product.title",
          brand: "$product.brand",
          rating: "$product.rating",
          // sizes: "$product.sizes",
          // images: "$product.images",
          product_url: "$product.product_url",

          // 📅 Dates
          oldDate: 1,
          latestDate: 1,

          // 💰 Prices
          oldPrice: 1,
          latestPrice: 1,

          priceChange: {
            $subtract: ["$latestPrice", "$oldPrice"],
          },

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
              "PRICE INCREASED",
              {
                $cond: [
                  { $lt: ["$latestPrice", "$oldPrice"] },
                  "PRICE DECREASED",
                  "NO CHANGE",
                ],
              },
            ],
          },
        },
      },
    ]);

    res.json({
      status: true,
      message: "Weekly Price Analysis with Product Details",
      total: report.length,
      data: report,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = { weeklyPriceAnalysis };
