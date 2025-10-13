const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Product = require('../models/productModel.js');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created upload directory:', uploadDir);
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
    const { sellerId } = req.params;
    const seller = await User.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Upload images (local upload — adjust for Cloudinary/S3 later)
    const imageFiles = req.files || [];
    const images = imageFiles.map((file) => ({
      imageUrl: `/uploads/${file.filename}`,
    }));

    const { title, description, price, category, stock } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      stock,
      seller: seller._id,
      images,
    });

    await newProduct.save();

    res
      .status(201)
      .json({
        message: '✅ Product uploaded successfully!',
        product: newProduct,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Product creation failed', error: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

module.exports = { upload, addProducts, getProducts };
