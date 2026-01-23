const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const cloudinary = require("../middlewares/cloudinary");
// Ensure uploads folder exists
// const uploadDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadDir)) {
// 	fs.mkdirSync(uploadDir, { recursive: true });
// 	console.log("📁 Created upload directory:", uploadDir);
// }

// // Multer setup
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => cb(null, uploadDir),
// 	filename: (req, file, cb) =>
// 		cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage });

// Add new product

const addProducts = async (req, res) => {
	try {
		const { sellerId } = req.params;
		const seller = await User.findById(sellerId);

		if (!seller) {
			return res.status(404).json({ message: "Seller not found" });
		}

		// Upload images (local upload — adjust for Cloudinary/S3 later)
		// const imageFiles = req.files || [];
		// const images = imageFiles.map((file) => ({
		// 	imageUrl: `/uploads/${file.filename}`,
		// }));

		const imageUrls = [];

		if (req.files && req.files.length > 0) {
			for (const file of req.files) {
				const uploadResult = await cloudinary.uploader.upload(
					`data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
					{ folder: "posts" },
				);

				// This logic ensures that even if a local URL somehow gets
				// attached, only the Cloudinary part is saved.
				let cleanUrl = uploadResult.secure_url;

				if (cleanUrl.includes("https://res.cloudinary.com")) {
					// If it contains Cloudinary, we strip everything before "https://"
					cleanUrl = cleanUrl.substring(cleanUrl.indexOf("https://"));
				}

				imageUrls.push({
					imageUrl: cleanUrl.trim(),
					public_id: uploadResult.public_id,
				});
			}
		}
		const { title, description, price, category, stock } = req.body;

		const newProduct = new Product({
			title,
			description,
			price,
			category,
			stock,
			seller: seller._id,
			images: imageUrls,
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
			},
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

// POST /product/searchProducts
const searchProducts = async (req, res) => {
	try {
		const { searchText } = req.body;

		if (!searchText || searchText.trim() === "") {
			return res.status(400).json({ message: "Search text is required" });
		}

		const lowerText = searchText.toLowerCase();

		// Simple search without regex
		const products = await Product.find({
			$or: [
				{ title: lowerText },
				{ description: lowerText },
				{ category: lowerText },
			],
		}).populate("seller", "name email"); // optional

		return res.status(200).json(products);
	} catch (error) {
		console.error("Error searching products:", error);
		return res.status(500).json({ message: "Server error", error });
	}
};
const decreaseStock = async (req, res) => {
	try {
		const { productId, quantity } = req.body;

		const product = await Product.findById(productId);
		if (!product) return res.status(404).json({ message: "Product not found" });

		if (product.stock < quantity) {
			return res.status(400).json({ message: "Not enough stock available" });
		}

		product.stock -= quantity;
		await product.save();

		res.status(200).json({
			message: "Stock decreased successfully",
			updatedStock: product.stock,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const increaseQuantity = async (req, res) => {
	try {
		const { buyerId } = req.params;
		const { productId } = req.body;

		const buyer = await User.findById(buyerId);
		if (!buyer || buyer.role !== "buyer")
			return res
				.status(404)
				.json({ success: false, message: "Buyer not found" });

		const product = await Product.findById(productId);
		if (!product)
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });

		if (product.stock <= 0)
			return res.status(400).json({ success: false, message: "Out of stock" });

		// Reduce stock
		product.stock -= 1;

		// Add buyer info
		const existingBuyer = product.buyer.find(
			(b) => b.user.toString() === buyerId,
		);
		if (existingBuyer) {
			existingBuyer.quantity += 1;
			existingBuyer.purchaseDate = new Date();
		} else {
			product.buyer.push({ user: buyerId, quantity: 1 });
		}

		await product.save();

		res
			.status(200)
			.json({ success: true, message: "Product increased in cart", product });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const decreaseQuantity = async (req, res) => {
	try {
		const { buyerId } = req.params;
		const { productId } = req.body;

		const buyer = await User.findById(buyerId);
		if (!buyer || buyer.role !== "buyer")
			return res
				.status(404)
				.json({ success: false, message: "Buyer not found" });

		const product = await Product.findById(productId);
		if (!product)
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });

		const buyerRecord = product.buyer.find(
			(b) => b.user.toString() === buyerId,
		);
		if (!buyerRecord || buyerRecord.quantity <= 0)
			return res
				.status(400)
				.json({ success: false, message: "No items in cart to decrease" });

		// Decrease buyer quantity
		buyerRecord.quantity -= 1;
		product.stock += 1;

		// Remove buyer from array if quantity is 0
		if (buyerRecord.quantity === 0) {
			product.buyer = product.buyer.filter(
				(b) => b.user.toString() !== buyerId,
			);
		}

		await product.save();

		res
			.status(200)
			.json({ success: true, message: "Product decreased in cart", product });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const resetQuantity = async (req, res) => {
	try {
		const { buyerId } = req.params;
		const { productId } = req.body;

		const buyer = await User.findById(buyerId);
		if (!buyer || buyer.role !== "buyer")
			return res
				.status(404)
				.json({ success: false, message: "Buyer not found" });

		const product = await Product.findById(productId);
		if (!product)
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });

		const buyerRecord = product.buyer.find(
			(b) => b.user.toString() === buyerId,
		);
		if (!buyerRecord)
			return res
				.status(400)
				.json({ success: false, message: "No items in cart" });

		// Restore stock
		product.stock += buyerRecord.quantity;

		// Remove buyer from product
		product.buyer = product.buyer.filter((b) => b.user.toString() !== buyerId);

		await product.save();

		res
			.status(200)
			.json({ success: true, message: "Product removed from cart", product });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const getCartItems = async (req, res) => {
	try {
		const { buyerId } = req.params;

		// 1️⃣ Validate buyerId
		if (!buyerId) {
			return res.status(400).json({ message: "Buyer ID is required" });
		}

		// 2️⃣ Fetch products where this buyer exists in the buyer array
		const cartItems = await Product.find({ "buyer.user": buyerId })
			.select("title price images buyer") // pick only needed fields
			.lean();

		// 3️⃣ If no items found
		if (!cartItems || cartItems.length === 0) {
			return res.status(404).json({ message: "No cart items found" });
		}

		// 4️⃣ Filter to include only this buyer’s details
		const filteredCart = cartItems.map((product) => {
			const buyerInfo = product.buyer.find(
				(b) => b.user.toString() === buyerId,
			);
			return {
				_id: product._id,
				title: product.title,
				price: product.price,
				images: product.images,
				quantity: buyerInfo?.quantity || 0,
				purchaseDate: buyerInfo?.purchaseDate || null,
			};
		});

		// 5️⃣ Send response
		res.status(200).json({
			success: true,
			count: filteredCart.length,
			cartItems: filteredCart,
		});
	} catch (error) {
		console.error("❌ Failed to fetch cart items:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch cart items",
			error: error.message,
		});
	}
};

const placeOrder = async (req, res) => {
	try {
		const { buyerId } = req.params;
		const { items } = req.body;

		// Validate input
		if (!buyerId || !items || !Array.isArray(items) || items.length === 0) {
			return res
				.status(400)
				.json({ message: "Invalid request. Missing buyer or items." });
		}

		// Loop through items
		const results = [];
		for (const item of items) {
			const { productId, quantity } = item;

			const product = await Product.findById(productId);
			if (!product) continue; // skip invalid products

			// Check stock availability
			if (product.stock < quantity) {
				return res.status(400).json({
					message: `Not enough stock for product: ${product.title}`,
				});
			}

			// Push buyer info
			product.buyer.push({
				user: buyerId,
				quantity,
				purchaseDate: new Date(),
			});

			// Decrease stock
			product.stock -= quantity;

			await product.save();

			results.push({
				productId: product._id,
				title: product.title,
				quantity,
				remainingStock: product.stock,
			});
		}

		res.status(200).json({
			success: true,
			message: "Order placed successfully",
			results,
		});
	} catch (error) {
		console.error("❌ Error placing order:", error);
		res.status(500).json({
			success: false,
			message: "Failed to place order",
			error: error.message,
		});
	}
};

const getOrders = async (req, res) => {
	try {
		const { buyerId } = req.params;
		if (!buyerId) {
			return res.status(400).json({ message: "Buyer ID is required" });
		}

		const products = await Product.find({ "buyer.user": buyerId })
			.select("title price images buyer")
			.lean();

		const orders = [];

		products.forEach((product) => {
			product.buyer.forEach((b) => {
				if (b.user.toString() === buyerId) {
					orders.push({
						_id: product._id,
						title: product.title,
						price: product.price,
						images: product.images,
						quantity: b.quantity,
						purchaseDate: b.purchaseDate,
					});
				}
			});
		});

		res.status(200).json({
			success: true,
			count: orders.length,
			orders,
		});
	} catch (error) {
		console.error("❌ Failed to fetch orders:", error);
		res.status(500).json({ success: false, message: "Failed to fetch orders" });
	}
};
module.exports = {
	addProducts,
	getProducts,
	updateProduct,
	getAllProducts,
	getProductById,
	deleteProductById,
	searchProducts,
	decreaseQuantity,
	increaseQuantity,
	resetQuantity,
	getCartItems,
	placeOrder,
	getOrders,
};
