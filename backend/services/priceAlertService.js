const PriceHistory = require("../models/priceHistoryModel");
const Product = require("../models/productModel");
const { sendPriceAlertEmail } = require("./emailService");

const checkAndSendPriceAlert = async (productId) => {
  const history = await PriceHistory.find({ product_id: productId })
    .sort({ scrape_date: -1 })
    .limit(2);

  if (history.length < 2) return;

  const latest = history[0].original_price;
  const previous = history[1].original_price;

  if (latest === previous) return;

  const diff = latest - previous;
  const percent = ((diff / previous) * 100).toFixed(2);

  const product = await Product.findById(productId);

  await sendPriceAlertEmail({
    product,
    oldPrice: previous,
    newPrice: latest,
    change: Math.abs(diff),
    percent: Math.abs(percent),
    trend: diff > 0 ? "INCREASED" : "DECREASED",
  });

  console.log(
    `📧 Alert sent → ${product.title} (${
      diff > 0 ? `HIKE - ₹${diff}` : `DROP - ₹${diff}`
    })`
  );
};

module.exports = { checkAndSendPriceAlert };
