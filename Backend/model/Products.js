const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
      trim: true,
    },
    rating: {
      rate: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
