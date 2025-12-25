const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true
    },

    brand: {
      type: String,
      trim: true,
    },

    // price: {
    //   type: Number,
    //   trim: true,
    // },

    // original_price: {
    //   type: Number,
    //   trim: true,
    // },

    // discount: {
    //   type: String,
    //   trim: true,
    // },

    rating: {
      type: Number,
    },

    sizes: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    colorImages: {
      type: [String],
      default: [],
    },

    productDescription: {
      type: String,
    },

    Specifications: {
      type: Map,
      of: String,
      default: {},
    },

    product_url: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
