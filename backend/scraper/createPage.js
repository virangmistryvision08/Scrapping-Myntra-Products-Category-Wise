async function createPage(browser) {
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    accept: "text/html,application/json",
    "accept-language": "en-IN,en;q=0.9",
    referer: "https://www.myntra.com/",
  });

  // await page.setViewport({ width: 100, height: 768 });
  return page;
}

module.exports = { createPage };
