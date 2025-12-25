const openMenDropdown = async (page, url) => {
  console.log("🔁 Opening MEN dropdown...");

  await page.waitForSelector(".desktop-navLinks", { timeout: 30000 });

  const menSelector = 'a.desktop-main[href="/shop/men"]';

  await page.waitForSelector(menSelector, {
    visible: true,
    timeout: 30000,
  });

  // Hover MEN
  await page.hover(menSelector);

  // Let animation finish
  await page.waitForTimeout(600);

  // Wait for dropdown container
  await page.waitForSelector(".desktop-categoryContainer", {
    visible: true,
    timeout: 30000,
  });

  // 🔥 MOVE MOUSE INTO DROPDOWN (CRITICAL)
  const dropdownBox = await page.$(".desktop-categoryContainer");
  const box = await dropdownBox.boundingBox();

  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
      steps: 5,
    });
  }

  // Optional: hover first category to show it is clickable
  let pathOnly;
  if (url) pathOnly = new URL(url).pathname;
  const category = `.desktop-categoryContainer a[href='${url ? pathOnly : "/men-topwear"}']`;

  const categoryExists = await page.$(category);
  if (categoryExists) {
    await page.hover(category);
    await page.waitForTimeout(600);
  }

  console.log("✅ MEN dropdown opened & category click.");
};

module.exports = { openMenDropdown };
