const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database Connected.");
  })
  .catch((error) => {
    console.log("Database Connection Error!", error);
  });
