const nodemailer = require("nodemailer");
const fs = require("fs/promises");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_APP_PASSWORD,
  },
});

const sendPriceAlertEmail = async ({
  product,
  oldPrice,
  newPrice,
  change,
  percent,
  trend,
}) => {
  const subject =
    trend === "INCREASED"
      ? "🔺 Price Increased Alert"
      : "🔻 Price Decreased Alert";

  /* ---------------- READ HTML FILE ---------------- */
  const filePath = path.join(__dirname, "..", "alert", "alertEmail.html");

  let html = await fs.readFile(filePath, "utf-8");

  /* ---------------- REPLACE PLACEHOLDERS ---------------- */
  html = html
    .replace(/{{PRODUCT_TITLE}}/g, product.title)
    .replace(/{{BRAND}}/g, product.brand)
    .replace(/{{OLD_PRICE}}/g, oldPrice)
    .replace(/{{NEW_PRICE}}/g, newPrice)
    .replace(/{{CHANGE_AMOUNT}}/g, change)
    .replace(/{{CHANGE_PERCENT}}/g, percent)
    .replace(/{{CHANGE_SYMBOL}}/g, trend === "INCREASED" ? "+" : "-")
    .replace(/{{CHANGE_COLOR}}/g, trend === "INCREASED" ? "#dc2626" : "#16a34a")
    .replace(/{{PRODUCT_URL}}/g, product.product_url)
    .replace(/{{CURRENT_YEAR}}/g, new Date().getFullYear());

  /* ---------------- SEND EMAIL ---------------- */
  await transporter.sendMail({
    from: `"Price Tracker" <${process.env.ALERT_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  });

  console.log(
    `📧 Email sent to ${process.env.ADMIN_EMAIL} → Product - ${product.title}`
  );
};

module.exports = { sendPriceAlertEmail };
