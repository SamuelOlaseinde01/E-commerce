const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true, trim: true },
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, "Please provide a value"],
        trim: true,
      },
      address: {
        type: String,
        required: [true, "Please provide a value"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "Please provide a value"],
        trim: true,
      },
      postalCode: {
        type: String,
        required: [true, "Please provide a value"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Please provide a value"],
        trim: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "cod"],
      trim: true,
      default: "cod",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      trim: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
