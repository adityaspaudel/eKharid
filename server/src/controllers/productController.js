const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Product = require("../models/productModel.js");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created upload directory:", uploadDir);
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Add new product
const addProducts = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      stock,
      sellerName,
      sellerEmail,
      seller,
    } = req.body;

    // Parse seller object if sent as JSON string
    let sellerData = {};
    if (seller) {
      try {
        sellerData = JSON.parse(seller);
      } catch (err) {
        console.warn("⚠️ Could not parse seller JSON:", err.message);
      }
    } else if (sellerName && sellerEmail) {
      // or take them from individual fields
      sellerData = { name: sellerName, email: sellerEmail };
    }

    if (!sellerData.name || !sellerData.email) {
      return res
        .status(400)
        .json({ message: "Seller details (name & email) required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const images = req.files.map((file) => ({
      imageUrl: `/uploads/${file.filename}`,
    }));

    const newProduct = await Product.create({
      title,
      description,
      price,
      category,
      stock,
      seller: sellerData,
      images,
    });

    res.status(201).json({
      message: "✅ Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Product creation failed:", error.message);
    res
      .status(500)
      .json({ message: "Product creation failed", error: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

module.exports = { upload, addProducts, getProducts };
