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

	// Fetch seller products
	const fetchProducts = useCallback(async () => {
		if (!sellerId) return;
		try {
			const { data } = await axios.get(
				`http://localhost:8000/seller/${sellerId}/getProducts`,
			);
			setProducts(data);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	}, [sellerId]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	// Toggle edit mode
	const handleEdit = (e, id) => {
		e.preventDefault();
		const product = products.find((p) => p._id === id);

		if (editingProductId === id) {
			setEditingProductId(null);
			setProductChange({
				title: "",
				description: "",
				price: "",
				category: "",
				stock: "",
			});
			setSelectedImages([]);
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

	// Update product
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
					`http://localhost:8000/product/${productId}/updateProduct`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } },
				);

				setProducts((prev) =>
					prev.map((p) => (p._id === productId ? data.updatedProduct : p)),
				);

				setEditingProductId(null);
				setProductChange({
					title: "",
					description: "",
					price: "",
					category: "",
					stock: "",
				});
				setSelectedImages([]);
				fetchProducts();
			} catch (error) {
				console.error("Error updating product:", error);
			}
		},
		[productChange, selectedImages, fetchProducts],
	);

	// Delete product
	const handleDelete = useCallback(async (e, productId) => {
		e.preventDefault();
		try {
			const res = await axios.delete(
				`http://localhost:8000/product/${productId}/deleteProductById`,
			);
			if (res.status === 200) {
				setProducts((prev) => prev.filter((p) => p._id !== productId));
				alert("Product deleted successfully!");
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("Failed to delete product.");
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
		<div className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200 p-6 flex flex-col gap-6 text-sm">
			{/* Header */}
			<div className="flex justify-between items-center bg-white rounded-xl shadow px-6 py-3">
				<Image
					src="/eKharidLogo.png"
					alt="eKharidLogo"
					height={80}
					width={80}
					className="cursor-pointer"
				/>
				<button
					onClick={handleLogout}
					className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition"
				>
					Logout
				</button>
			</div>

			{/* Add product button */}
			<div className="flex justify-center">
				<button
					onClick={addProductTogglerUpdate}
					className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
				>
					+ Add Product
				</button>
			</div>

			{/* Add Product Form */}
			<div
				className={`${toggleAddProduct} bg-white rounded-xl shadow-md p-4 w-full max-w-md mx-auto`}
			>
				<AddProducts sellerId={sellerId} fetchProducts={fetchProducts} />
			</div>

			<h1 className="text-2xl font-bold text-center">My Products List</h1>

			{/* Product List */}
			{products.length === 0 ? (
				<p className="text-center text-gray-600">No products found.</p>
			) : (
				<div className="flex flex-wrap justify-center gap-4">
					{products.map((product) => (
						<div
							key={product._id}
							className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 w-60 border"
						>
							{/* Images */}
							<div className="flex gap-2 overflow-x-auto mb-3 pb-1">
								{product.images.map((img, idx) => (
									<Image
										key={idx}
										src={img.imageUrl}
										alt={`Product ${idx + 1}`}
										width={120}
										height={120}
										className="rounded object-cover border shrink-0"
									/>
								))}
							</div>

							{/* Details */}
							<div className="flex flex-col gap-1 text-sm mb-2">
								{["title", "description", "price", "category", "stock"].map(
									(field) => (
										<p key={field} className="text-gray-700 truncate">
											<span className="font-medium capitalize">{field}:</span>{" "}
											{product[field]}
										</p>
									),
								)}
							</div>

							{/* Actions */}
							<div className="flex justify-between items-center mt-2">
								<button
									onClick={(e) => handleEdit(e, product._id)}
									disabled={
										editingProductId && editingProductId !== product._id
									}
									className="text-indigo-600 font-medium hover:underline"
								>
									{editingProductId === product._id ? "Close" : "Edit"}
								</button>

								<button
									onClick={(e) => handleDelete(e, product._id)}
									className="text-red-500 font-medium hover:underline"
								>
									Delete
								</button>
							</div>

							{/* Edit Form */}
							{editingProductId === product._id && (
								<div className="bg-gray-50 border rounded-lg p-4 mt-4 flex flex-col gap-2">
									{Object.keys(productChange).map((field) => (
										<div key={field} className="flex flex-col text-sm gap-1">
											<label className="capitalize font-medium">{field}</label>
											<input
												name={field}
												value={productChange[field]}
												onChange={handleChange}
												className="border rounded px-2 py-1"
											/>
										</div>
									))}

									<div>
										<label className="font-medium">Upload New Images</label>
										<input
											type="file"
											multiple
											onChange={handleImageChange}
											className="mt-1 text-sm"
										/>
										{selectedImages.length > 0 && (
											<div className="flex gap-2 mt-2 overflow-x-auto">
												{selectedImages.map((file, idx) => (
													<Image
														key={idx}
														src={URL.createObjectURL(file)}
														alt="Preview"
														width={60}
														height={60}
														className="rounded object-cover border shrink-0"
													/>
												))}
											</div>
										)}
									</div>

									<div className="flex gap-2 mt-3">
										<button
											onClick={(e) =>
												handleSaveAndUpdateProduct(e, product._id)
											}
											className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-3 py-1 rounded"
										>
											Update
										</button>
										<button
											onClick={() => setEditingProductId(null)}
											className="bg-gray-400 hover:bg-gray-500 transition text-white px-3 py-1 rounded"
										>
											Cancel
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
});
