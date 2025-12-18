require("dotenv").config();
const puppeteer = require("puppeteer");
const { scrapeSingleProduct } = require("../scraper/scrapeSingleProduct");
const { createPage } = require("../scraper/createPage");

const CATEGORY_URL = process.env.CATEGORY_URL;

const scrapeMyntraProduct = async (req, res) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  try {
    // Category Page
    const page = await createPage(browser);

    console.log("Opening URL...");
    await page.goto(CATEGORY_URL, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Myntra is CSR → wait for mountRoot
    await page.waitForSelector('[id*="desktop-header-cnt"]', {
      timeout: 30000,
    });

    // Extract elements
    const categoryTabs = await page.evaluate(() => {
      const nodes = document.querySelectorAll('ul[data-reactid="27"] > li > a');

      return Array.from(nodes).map((el) => ({
        href: el.href,
        html: el.innerHTML,
      }));
    });

    console.log(`Found ${categoryTabs.length} Category element(s)\n`);

    // SCRAPE PRODUCTS ONE BY ONE (SAFE)
    for (const item of categoryTabs) {
      await tabsLink(browser, item.href);
    }

    // Product Page Url
    async function tabsLink(browser, url) {
      const page1 = await createPage(browser);

      console.log(`Opening ${url} URL...`);
      await page1.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      // Myntra is CSR → wait for mountRoot
      await page1.waitForSelector('ul[class*="results-base"]', {
        timeout: 30000,
      });

      // Extract elements
      const productLink = await page1.evaluate(() => {
        const nodes = document.querySelectorAll(
          'li[class="product-base"] > a'
        );

        return Array.from(nodes).map((el) => ({
          href: el.href,
          html: el.innerHTML,
        }));
      });

      console.log(`Found ${productLink.length} Products element(s)\n`);

      // SCRAPE PRODUCTS ONE BY ONE
      for (const item of productLink) {
        await scrapeSingleProduct(browser, item.href);
      }
    }

    return res
      .status(200)
      .json({ status: true, message: "All Products Save in Database." });
  } catch (err) {
    console.error("❌ Error:", err.message);
    return res.status(500).json({ status: false, message: err.message });
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeMyntraProduct };
