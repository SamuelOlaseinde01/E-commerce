const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
    rating: {
      rate: { type: Number, default: 0 },
      count: { type: Number, default: 0 }, // stock count
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
