const cron = require("node-cron");
const {
  scrapeMyntraProduct,
} = require("../controllers/myntraScrappingController");

// Runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Daily Myntra scraping started");
  await scrapeMyntraProduct();
});
