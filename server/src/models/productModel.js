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
			required: true,
			min: [0, "Stock cannot be negative"],
			validate: {
				validator: Number.isInteger,
				message: "Stock must be an integer",
			},
		},
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		buyer: {
			type: [
				{
					user: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
						required: true,
					},
					quantity: {
						type: Number,
						required: true,
						min: [1, "Quantity must be at least 1"],
					},
					purchaseDate: {
						type: Date,
						default: Date.now,
					},
				},
			],
			default: [],
		},
		images: [
			{
				imageUrl: { type: String, required: true },
				altText: { type: String, default: "" },
				isPrimary: { type: Boolean, default: false },
			},
		],
		status: {
			type: String,
			enum: ["available", "sold", "hidden"],
			default: "available",
		},
	},
	{ timestamps: true },
);

// Indexes
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });

// Auto availability middleware
productSchema.pre("save", function (next) {
	if (this.stock > 0 && this.status !== "hidden") {
		this.status = "available";
	} else if (this.stock === 0) {
		this.status = "sold";
	}
	next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
