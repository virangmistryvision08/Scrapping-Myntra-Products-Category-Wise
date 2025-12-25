// require("dotenv").config();
const puppeteer = require("puppeteer");
const { scrapeSingleProduct } = require("../scraper/scrapeSingleProduct");
const { createPage } = require("../scraper/createPage");
const { openMenDropdown } = require("../scraper/openingMenDropDown");

const CATEGORY_URL = process.env.CATEGORY_URL;

const scrapeMyntraProduct = async () => {
  const visitedCategories = new Set();

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
    defaultViewport: null,
  });

  try {
    /* ---------------- OPEN HOME ---------------- */
    const homePage = await createPage(browser);

    console.log("🏠 Opening Myntra...");
    await homePage.goto(CATEGORY_URL, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    /* ---------------- OPEN MEN DROPDOWN ---------------- */
    await openMenDropdown(homePage);

    /* ---------------- COLLECT CATEGORY URLS ---------------- */
    const categoryTabs = await homePage.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".desktop-categoryContainer ul.desktop-navBlock[data-reactid='27'] a[href]")
      ).map((a) => a.href)
      // .filter((href) => href.includes("/men-"));
    });

    console.log(`📂 Found ${categoryTabs.length} categories\n`);

    /* ---------------- LOOP CATEGORIES ---------------- */
    for (const categoryUrl of categoryTabs) {
      if (visitedCategories.has(categoryUrl)) continue;

      visitedCategories.add(categoryUrl);
      console.log(`\n📁 CATEGORY → ${categoryUrl}`);

      await scrapeCategory(browser, categoryUrl);

      // 🔁 Re-open navbar for next category
      await homePage.bringToFront();
      const pathOnly = new URL(categoryUrl).pathname;
      await openMenDropdown(homePage, pathOnly);
    }

    await homePage.close();

  } catch (err) {
    console.error("❌ Fatal Error:", err.message);
  } finally {
    await browser.close();
  }
};

/* ================= CATEGORY SCRAPER ================= */
async function scrapeCategory(browser, categoryUrl) {
  const page = await createPage(browser);

  console.log(`🌐 Opening category → ${categoryUrl}`);
  await page.goto(categoryUrl, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  await page.waitForSelector("li.product-base", { timeout: 30000 });

  let pageCount = 1;

  while (true) {
    console.log(`📄 Scraping page ${pageCount}`);

    /* -------- SCRAPE PRODUCTS -------- */
    const productLinks = await page.evaluate(() =>
      Array.from(document.querySelectorAll("li.product-base > a")).map(
        (el) => el.href
      )
    );

    console.log(`🛍 Found ${productLinks.length} products`);

    for (const href of productLinks) {
      await scrapeSingleProduct(browser, href);
    }

    /* -------- CHECK NEXT BUTTON -------- */
    const hasNext = await page.$(".pagination-next");
    // :not(.pagination-disabled)

    if (!hasNext) {
      console.log("⛔ No next page → category completed");
      break;
    }

    console.log("➡️ Clicking NEXT (visible click)");

    /* -------- SCROLL INTO VIEW -------- */
    await page.evaluate(() => {
      document
        .querySelector(".pagination-next")
        // :not(.pagination-disabled)
        .scrollIntoView({ behavior: "smooth", block: "center" });
    });

    await page.waitForTimeout(800);

    /* -------- CLICK + WAIT FOR NEW PRODUCTS -------- */
    const firstProductBefore = await page.evaluate(
      () => document.querySelector("li.product-base > a")?.href
    );

    await Promise.all([
      page.click(".pagination-next"),
      // :not(.pagination-disabled)
      page.waitForFunction(
        (prev) => {
          const first = document.querySelector("li.product-base > a")?.href;
          return first && first !== prev;
        },
        { timeout: 60000 },
        firstProductBefore
      ),
    ]);

    console.log("✅ Next page loaded");

    pageCount++;
  }

  await page.close();
}

module.exports = { scrapeMyntraProduct };
