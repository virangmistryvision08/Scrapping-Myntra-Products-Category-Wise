const express = require("express");
const { scrapeMyntraProduct } = require("../controllers/myntraScrapping");
const router = express.Router();

router.get("/myntra-product", scrapeMyntraProduct);

module.exports = router;
