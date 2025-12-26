const cron = require("node-cron");
const {
  scrapeMyntraProduct,
} = require("../controllers/myntraScrappingController");

// Runs every day at 2 PM
cron.schedule("01 15 * * *", async () => {
  console.log("⏰ Daily Myntra scraping started");
  await scrapeMyntraProduct();
});
