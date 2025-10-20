const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Product = require("../models/productModel");
const User = require("../models/userModel");

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
    const { sellerId } = req.params;
    const seller = await User.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
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

    res.status(201).json({
      message: "✅ Product added successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Product creation failed", error: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ seller: sellerId });

    res.status(200).json(products);

    console.log(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // 🧾 Text fields
    const { title, description, price, stock, category } = req.body;

    // 🖼️ New uploaded images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => ({
        imageUrl: `/uploads/${file.filename}`,
      }));
    }

    // ✅ Find existing product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Merge existing images with new uploads
    const updatedImages = [...product.images, ...newImages];

    // ✅ Build update object
    const updateData = {
      title,
      description,
      price,
      stock,
      category,
      images: updatedImages,
    };

    // ✅ Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});

    res.status(200).json({
      message: "All products fetched successfully",
      products: allProducts,
    });
  } catch (error) {
    console.error("Error getting all products:", error);

    res.status(500).json({
      message: "Failed to fetch products due to a server error.",
      error: error.message || "Unknown error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "product not found" });
    } else {
      res
        .status(200)
        .json({ message: "product fetched successfully", product });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error or invalid ID format" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product deleted successfully:", deletedProduct);
    return res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
module.exports = {
  upload,
  addProducts,
  getProducts,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
};
