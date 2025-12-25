require("dotenv").config();
require("./config/dbConnect");
require("./cron/dailyScrape");
const express = require("express");
const app = express();
const port = +process.env.PORT;
const productRoute = require("./routes/productRoute");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", productRoute);

app.listen(port, () => {
  console.log("Server Started at PORT -", port);
});
