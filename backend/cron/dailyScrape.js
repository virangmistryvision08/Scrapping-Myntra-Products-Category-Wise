const cron = require("node-cron");
const {
  scrapeMyntraProduct,
} = require("../controllers/myntraScrappingController");

// Runs every day at 1 PM
cron.schedule("27 10 * * *", async () => {
  console.log("⏰ Daily Myntra scraping started");
  await scrapeMyntraProduct();
});
