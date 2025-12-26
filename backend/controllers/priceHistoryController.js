const PriceHistory = require("../models/priceHistoryModel");

const priceHistoryFunc = async (req, res) => {
  try {
    const history = await PriceHistory.find({
      product_id: req.params.productId,
    })
      .sort({ scrape_date: 1 })
      .select("original_price scrape_date");

    res.json({
      status: true,
      data: history,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = { priceHistoryFunc };
