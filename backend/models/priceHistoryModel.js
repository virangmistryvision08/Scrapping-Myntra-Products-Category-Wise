const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      index: true,
    },
    scrape_date: { type: Date, index: true },
    price: {
      type: Number,
      trim: true,
    },

    original_price: {
      type: Number,
      trim: true,
    },

    discount: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

schema.index({ product_id: 1, scrape_date: 1 }, { unique: true });

module.exports = mongoose.model("PriceHistory", schema);
