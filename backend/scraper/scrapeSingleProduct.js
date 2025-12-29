const { createPage } = require("./createPage");
const Product = require("../models/productModel");
const PriceHistory = require("../models/priceHistoryModel");
const { checkAndSendPriceAlert } = require("../services/priceAlertService");

async function scrapeSingleProduct(browser, url) {
  const page = await createPage(browser);

  try {
    console.log("Opening product:", url);

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.waitForSelector('[id*="mountRoot"]', {
      timeout: 30000,
    });

    // SINGLE PRODUCT OBJECT
    const product = await page.evaluate(() => {
      const getText = (...selectors) => {
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el && el.textContent.trim()) {
            return el.textContent.trim();
          }
        }
        return null;
      };
      const getSizes = (...selectors) => {
        for (const sel of selectors) {
          const nodes = document.querySelectorAll(sel);
          if (nodes.length) {
            return Array.from(nodes).map((el) => {
              if (el && el.textContent.trim()) {
                return el.textContent.trim();
              }
            });
          }
        }
        return [];
      };
      const getImages = (...selectors) => {
        for (const sel of selectors) {
          const nodes = document.querySelectorAll(sel);
          if (nodes.length) {
            return Array.from(nodes)
              .map((el) => {
                const style = el.style.backgroundImage;
                if (!style) return null;
                // Extract URL from: url("...")
                const match = style.match(/url\(["']?(.*?)["']?\)/);
                return match ? match[1] : null;
              })
              .filter(Boolean);
          }
        }
        return [];
      };
      const getColorImages = (...selectors) => {
        for (const sel of selectors) {
          const nodes = document.querySelectorAll(sel);
          if (nodes.length) {
            return Array.from(nodes).map((el) => {
              const image = el.src;
              if (!image) return null;
              return image;
            });
          }
        }
        return [];
      };
      const getSpecifications = () => {
        const specs = {};
        const rows = document.querySelectorAll(".index-row");
        rows.forEach((row) => {
          const keyEl = row.querySelector(".index-rowKey");
          const valueEl = row.querySelector(".index-rowValue");
          if (!keyEl || !valueEl) return;
          const key = keyEl.textContent.trim();
          const value = valueEl.textContent.trim();
          if (key && value) {
            specs[key] = value;
          }
        });
        return specs;
      };
      return {
        title: getText(".pdp-name", "[class*='pdp-name']"),
        brand: getText(".pdp-title", "[class*='pdp-title']"),
        price: (() => {
          const text = getText(".pdp-mrp s", "[class*='mrp']");
          if (!text) return null;
          // Remove ₹, commas, spaces → keep numbers only
          return Number(text.replace(/[^\d]/g, ""));
        })(),
        original_price: (() => {
          const text = getText(".pdp-price strong", "[class*='pdp-price']");
          if (!text) return null;
          // Remove ₹, commas, spaces → keep numbers only
          return Number(text.replace(/[^\d]/g, ""));
        })(),
        discount: getText(".pdp-discount", "[class*='discount']"),
        rating: Number(
          getText(".index-overallRating > div:first-child", "[class*='rating']")
        ),
        sizes: getSizes(".size-buttons-unified-size"),
        images: getImages(".image-grid-col50 .image-grid-image"),
        colorImages: getColorImages(".colors-image"),
        productDescription: getText(".pdp-product-description-content"),
        Specifications: getSpecifications(),
        product_url: window.location.href,
      };
    });

    if (!product.title || !product.price) return;

    let savedProduct = await Product.findOne({
      product_url: product.product_url,
    });

    if (!savedProduct) {
      savedProduct = await Product.create(product);
      console.log("✔ New Product:", product.title);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await PriceHistory.updateOne(
      { product_id: savedProduct._id, scrape_date: today },
      {
        $set: {
          price: product.price,
          original_price: product.original_price,
          discount: product.discount,
        },
      },
      { upsert: true }
    );

    // Check And Send Price ALERT
    await checkAndSendPriceAlert(savedProduct._id);

  } catch (err) {
    console.error("❌ Product error:", err.message);
  } finally {
    await page.close();
  }
}

module.exports = { scrapeSingleProduct };
