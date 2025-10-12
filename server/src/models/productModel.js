const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be positive"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    stock: {
      type: Number,
      default: 1,
      min: [0, "Stock cannot be negative"],
    },
    seller: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    images: [
      {
        imageUrl: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
