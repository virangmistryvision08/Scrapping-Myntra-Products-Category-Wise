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
      }));
    });

    console.log(`Found ${categoryTabs.length} Category element(s)\n`);

    // SCRAPE PRODUCTS ONE BY ONE (SAFE)
    for (const item of categoryTabs) {
      await tabsLink(browser, item.href);
    }

    // Product Page Url
    async function tabsLink(browser, url) {
      let pageNumber = 1;
      const MAX_PAGES = 2; // limit
      const perPage = 5;
    //   let pageinationFinisher = false;

      while (pageNumber <= MAX_PAGES) {
        const page = await createPage(browser);
        const paginatedUrl = `${url}?p=${pageNumber}&rows=${perPage}`;

        console.log(`Opening Page ${pageNumber}: ${paginatedUrl}`);

        //   const page = await createPage(browser);

        //   console.log(`Opening ${url} URL...`);
        try {
        //   if (!pageinationFinisher) {
            await page.goto(paginatedUrl, {
              waitUntil: "networkidle2",
              timeout: 60000,
            });
        //   }

          //   try {
          await page.waitForSelector('[id*="mountRoot"]', {
            timeout: 30000,
          });
          //   } catch {
          //     console.log("No product container found!");
          //     await page.close();
          //     break;
          //   }

          // Extract elements
          const productLink = await page.evaluate(() => {
            const nodes = document.querySelectorAll(
              'li[class="product-base"] > a'
            );

            return Array.from(nodes).map((el) => ({
              href: el.href,
            }));
          });

          if (!productLink.length) {
            console.log("No more products. Pagination finished.");
            await page.close();
            break;
          }

          console.log(
            `Page ${pageNumber} → Found ${productLink.length} products`
          );

          // console.log(`Found ${productLink.length} Products element(s)\n`);

          // SCRAPE PRODUCTS ONE BY ONE
          for (const item of productLink.slice(0, perPage)) {
            await scrapeSingleProduct(browser, item.href);
          }
        } catch (err) {
          console.log(`❌ Page ${pageNumber} failed:`, err.message);
          break;
        } finally {
          // ALWAYS close the page after finishing that page
          await page.close();
        //   pageinationFinisher = true;
          console.log(`🧹 Closed Page ${pageNumber}`);
        }

        pageNumber++;
        // await page.close();
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
