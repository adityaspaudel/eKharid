"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import AddProducts from "@/components/addProducts";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default memo(function SellerHome() {
	const { sellerId } = useParams();
	const router = useRouter();

	const [products, setProducts] = useState([]);
	const [editingProductId, setEditingProductId] = useState(null);
	const [productChange, setProductChange] = useState({
		title: "",
		description: "",
		price: "",
		category: "",
		stock: "",
	});
	const [selectedImages, setSelectedImages] = useState([]);
	const [toggleAddProduct, setToggleAddProduct] = useState("hidden");
	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
	const fetchProducts = useCallback(async () => {
		if (!sellerId) return;
		try {
			const { data } = await axios.get(
				`${NEXT_PUBLIC_API_URL}/seller/${sellerId}/getProducts`,
			);
			setProducts(data);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	}, [sellerId]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const handleEdit = (e, id) => {
		e.preventDefault();
		const product = products.find((p) => p._id === id);

		if (editingProductId === id) {
			setEditingProductId(null);
		} else {
			setEditingProductId(id);
			setProductChange({
				title: product.title,
				description: product.description,
				price: product.price,
				category: product.category,
				stock: product.stock,
			});
			setSelectedImages([]);
		}
	};

	const handleChange = (e) =>
		setProductChange({ ...productChange, [e.target.name]: e.target.value });

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		if (files.length <= 5) {
			setSelectedImages(files);
		} else {
			alert("You can't upload more than 5 images");
		}
	};

	const handleSaveAndUpdateProduct = useCallback(
		async (e, productId) => {
			e.preventDefault();
			try {
				const formData = new FormData();
				Object.entries(productChange).forEach(([key, value]) =>
					formData.append(key, value),
				);
				selectedImages.forEach((file) => formData.append("images", file));

				const { data } = await axios.put(
					`${NEXT_PUBLIC_API_URL}/product/${productId}/updateProduct`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } },
				);

				setEditingProductId(null);
				fetchProducts();
			} catch (error) {
				console.error("Error updating product:", error);
			}
		},
		[productChange, selectedImages, fetchProducts],
	);

	const handleDelete = useCallback(async (e, productId) => {
		e.preventDefault();
		if (!confirm("Are you sure you want to delete this product?")) return;
		try {
			const res = await axios.delete(
				`${NEXT_PUBLIC_API_URL}/product/${productId}/deleteProductById`,
			);
			if (res.status === 200) {
				setProducts((prev) => prev.filter((p) => p._id !== productId));
			}
		} catch (error) {
			console.error("Error deleting product:", error);
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("userToken");
		router.push("/login");
	};

	const addProductTogglerUpdate = (e) => {
		e.preventDefault();
		setToggleAddProduct((prev) => (prev === "hidden" ? "block" : "hidden"));
	};

	return (
		// Background: Dark Gray (Stone-950)
		<div className="min-h-screen bg-stone-950 text-stone-100 p-6 flex flex-col gap-8">
			{/* Header */}
			<header className="flex justify-between items-center bg-stone-900 border border-stone-800 rounded-2xl px-8 py-4 shadow-2xl">
				<div className="flex items-center gap-4">
					<Image
						src="/eKharidLogo.png"
						alt="logo"
						height={60}
						width={60}
						className="cursor-pointer brightness-110"
					/>
					<h2 className="text-xl font-bold tracking-tight hidden sm:block">
						Seller <span className="text-orange-600">Dashboard</span>
					</h2>
				</div>
				<button
					onClick={handleLogout}
					className="bg-stone-800 border border-stone-700 text-stone-300 px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
				>
					Logout
				</button>
			</header>

			{/* Main Controls */}
			<div className="flex flex-col items-center gap-6">
				<button
					onClick={addProductTogglerUpdate}
					className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl shadow-lg shadow-orange-900/40 font-bold transition-all active:scale-95 flex items-center gap-2"
				>
					<span className="text-xl">+</span> Add New Product
				</button>

				{/* Add Product Form Container */}
				<div
					className={`${toggleAddProduct} w-full max-w-2xl animate-in fade-in slide-in-from-top-4 duration-300`}
				>
					<div className="bg-white rounded-2xl p-1 shadow-2xl border-t-4 border-orange-600">
						<AddProducts sellerId={sellerId} fetchProducts={fetchProducts} />
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-4">
					<div className="h-[1px] flex-1 bg-stone-800"></div>
					<h1 className="text-2xl font-black uppercase tracking-widest text-stone-400">
						Inventory
					</h1>
					<div className="h-[1px] flex-1 bg-stone-800"></div>
				</div>

				{/* Product Grid */}
				{products.length === 0 ? (
					<div className="text-center py-20 bg-stone-900/50 rounded-3xl border border-dashed border-stone-800">
						<p className="text-stone-500 text-lg">
							Your inventory is empty. Start by adding a product.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{products.map((product) => (
							<div
								key={product._id}
								className="bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col group transition-all hover:ring-2 hover:ring-orange-600"
							>
								{/* Image Gallery */}
								<div className="relative h-48 bg-stone-100 flex gap-1 overflow-x-auto p-2 snap-x">
									{product.images.map((img, idx) => (
										<Image
											key={idx}
											src={img.imageUrl}
											alt={product.title}
											width={200}
											height={200}
											className="h-full w-full object-cover rounded-lg shrink-0 snap-center border border-stone-200"
										/>
									))}
									<div className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] px-2 py-1 rounded-md uppercase font-bold backdrop-blur-sm">
										{product.category}
									</div>
								</div>

								{/* Content */}
								<div className="p-5 flex flex-col gap-3">
									<div>
										<h3 className="text-stone-900 font-bold text-lg truncate">
											{product.title}
										</h3>
										<p className="text-stone-500 text-xs line-clamp-2 mt-1">
											{product.description}
										</p>
									</div>

									<div className="flex justify-between items-end border-t border-stone-100 pt-3">
										<div className="flex flex-col">
											<span className="text-stone-400 text-[10px] uppercase font-bold">
												Price
											</span>
											<span className="text-orange-600 font-black text-xl">
												Rs. {product.price}
											</span>
										</div>
										<div className="flex flex-col items-end">
											<span className="text-stone-400 text-[10px] uppercase font-bold">
												Stock
											</span>
											<span
												className={`font-bold ${product.stock < 10 ? "text-red-500" : "text-stone-700"}`}
											>
												{product.stock} units
											</span>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-2 mt-2">
										<button
											onClick={(e) => handleEdit(e, product._id)}
											className={`flex-1 py-2 rounded-xl font-bold text-xs transition-colors ${
												editingProductId === product._id
													? "bg-stone-800 text-white"
													: "bg-stone-100 text-stone-600 hover:bg-stone-200"
											}`}
										>
											{editingProductId === product._id
												? "Close"
												: "Edit Product"}
										</button>
										<button
											onClick={(e) => handleDelete(e, product._id)}
											className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
										>
											<TrashIcon />
										</button>
									</div>
								</div>

								{/* Inline Edit Form Overlay */}
								{editingProductId === product._id && (
									<div className="p-5 bg-stone-50 border-t-2 border-orange-500 animate-in slide-in-from-bottom-2">
										<div className="grid grid-cols-2 gap-3">
											{["title", "price", "stock", "category"].map((field) => (
												<div
													key={field}
													className={`${field === "title" ? "col-span-2" : ""}`}
												>
													<label className="text-[10px] uppercase font-bold text-stone-500 ml-1">
														{field}
													</label>
													<input
														name={field}
														value={productChange[field]}
														onChange={handleChange}
														className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-stone-900 text-sm focus:ring-2 focus:ring-orange-600 focus:outline-none"
													/>
												</div>
											))}
											<div className="col-span-2 mt-2">
												<label className="text-[10px] uppercase font-bold text-stone-500 ml-1">
													Update Images
												</label>
												<input
													type="file"
													multiple
													onChange={handleImageChange}
													className="text-xs text-stone-500 mt-1 block w-full"
												/>
											</div>
											<button
												onClick={(e) =>
													handleSaveAndUpdateProduct(e, product._id)
												}
												className="col-span-2 bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 transition shadow-md shadow-orange-900/20"
											>
												Save Changes
											</button>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
});

// Simple Trash Icon Component
const TrashIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
	</svg>
);
