const express = require("express");
const {
  scrapeMyntraProduct,
} = require("../controllers/myntraScrappingController");
const {
  weeklyPriceAnalysis,
} = require("../controllers/weeklyPriceAnalysisController");
const { priceHistoryFunc } = require("../controllers/priceHistoryController");

const router = express.Router();

router.get("/myntra-product", async (req, res) => {
  scrapeMyntraProduct();
  res
    .status(200)
    .json({ status: true, message: "Scraping started in background" });
});

router.get("/weekly-report", weeklyPriceAnalysis);
router.get("/price-history/:productId", priceHistoryFunc);

module.exports = router;
