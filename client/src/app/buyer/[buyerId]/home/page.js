"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Info, Search, LogOut } from "lucide-react";
import { IoAddCircleSharp } from "react-icons/io5";
import { AiFillMinusCircle } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";

const IMAGE_BASE_URL = "http://localhost:8000";

const BuyerHome = () => {
	const { buyerId } = useParams();
	const router = useRouter();

	const [productsList, setProductsList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [searchText, setSearchText] = useState("");

	const getAllProducts = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(`${IMAGE_BASE_URL}/product/getAllProducts`);
			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`);
			const data = await response.json();
			setProductsList(data.products || []);
		} catch (err) {
			setError("Failed to load products. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		getAllProducts();
	}, [getAllProducts]);

	const handleSearch = useCallback(async () => {
		if (!searchText.trim()) {
			getAllProducts();
			return;
		}
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(`${IMAGE_BASE_URL}/product/searchProducts`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ searchText }),
			});
			if (!response.ok) throw new Error("Failed to search product");
			const data = await response.json();
			setProductsList(data);
		} catch (err) {
			setError("Failed to search products.");
		} finally {
			setIsLoading(false);
		}
	}, [searchText, getAllProducts]);

	const handleIncrease = async (productId) => {
		try {
			const res = await fetch(
				`${IMAGE_BASE_URL}/product/${buyerId}/increaseQuantity`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ productId }),
				},
			);
			const data = await res.json();
			setProductsList((prev) =>
				prev.map((p) => (p._id === productId ? data.product : p)),
			);
		} catch (err) {
			alert("Out of stock!");
		}
	};

	const handleDecrease = async (productId) => {
		try {
			const res = await fetch(
				`${IMAGE_BASE_URL}/product/${buyerId}/decreaseQuantity`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ productId }),
				},
			);
			const data = await res.json();
			setProductsList((prev) =>
				prev.map((p) => (p._id === productId ? data.product : p)),
			);
		} catch (err) {
			console.error(err);
		}
	};

	const handleReset = async (productId) => {
		try {
			const res = await fetch(
				`${IMAGE_BASE_URL}/product/${buyerId}/resetQuantity`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ productId }),
				},
			);
			const data = await res.json();
			setProductsList((prev) =>
				prev.map((p) => (p._id === productId ? data.product : p)),
			);
		} catch (err) {
			console.error(err);
		}
	};

	if (isLoading)
		return (
			<div className="flex justify-center items-center min-h-screen text-orange-600 font-bold">
				Loading...
			</div>
		);

	return (
		<div className="bg-[#f4f4f4] min-h-screen">
			{/* HEADER SECTION - DARK GRAY */}
			<header className="bg-gray-900 text-white shadow-xl sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
					<Image
						src="/eKharidLogo.png"
						alt="logo"
						height={50}
						width={120}
						className="brightness-100 invert  cursor-pointer"
					/>

					{/* Search Bar Container */}
					<div className="flex flex-1 max-w-lg w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
						<input
							className="bg-transparent px-4 py-2 w-full outline-none text-white placeholder-gray-400"
							type="text"
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							placeholder="Search products..."
						/>
						<button
							onClick={handleSearch}
							className="bg-orange-600 hover:bg-orange-700 px-4 transition-colors"
						>
							<Search className="w-5 h-5" />
						</button>
					</div>

					<div className="flex items-center gap-4">
						<Link
							href={`/buyer/${buyerId}/home/myCart`}
							className="relative p-2 hover:text-orange-500 transition-colors"
						>
							<ShoppingCart className="w-6 h-6" />
						</Link>
						<Link
							href={`/buyer/${buyerId}/home/myOrders`}
							className="p-2 hover:text-orange-500 transition-colors"
						>
							🛍️
						</Link>
						<button
							onClick={() => router.push("/login")}
							className="flex items-center gap-2 bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-1.5 rounded-lg transition-all font-medium"
						>
							<LogOut className="w-4 h-4" /> Logout
						</button>
					</div>
				</div>
			</header>

			{/* MAIN CONTENT */}
			<main className="max-w-7xl mx-auto p-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{productsList.map((product) => {
						const buyerRecord = product.buyer.find((b) => b.user === buyerId);
						const currentQuantity = buyerRecord ? buyerRecord.quantity : 0;
						const isAvailable = product.stock > 0;

						return (
							<div
								key={product._id}
								className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden group"
							>
								{/* Image Section */}
								<Link
									href={`/buyer/${buyerId}/home/${product._id}/productDetails`}
									className="relative h-48 overflow-hidden"
								>
									<Image
										className="object-cover transition-transform duration-500 group-hover:scale-110"
										alt={product.title}
										src={product.images[0]?.imageUrl}
										fill
									/>
									{!isAvailable && (
										<div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold uppercase tracking-wider">
											Out of Stock
										</div>
									)}
								</Link>

								{/* Content Section */}
								<div className="p-4 flex flex-col flex-grow">
									<span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">
										{product.category}
									</span>
									<h3 className="text-gray-900 font-bold truncate mb-1">
										{product.title}
									</h3>
									<p className="text-gray-500 text-xs line-clamp-2 mb-4">
										{product.description}
									</p>

									<div className="mt-auto">
										<div className="flex justify-between items-end mb-4">
											<span className="text-xl font-black text-gray-900">
												Rs. {product.price.toLocaleString()}
											</span>
											<span
												className={`text-[11px] font-bold ${isAvailable ? "text-green-600" : "text-red-500"}`}
											>
												{isAvailable ? `${product.stock} LEFT` : "SOLD OUT"}
											</span>
										</div>

										{/* Action Buttons */}
										{currentQuantity === 0 ? (
											<button
												className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
													isAvailable
														? "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200 shadow-lg"
														: "bg-gray-300 text-gray-500 cursor-not-allowed"
												}`}
												onClick={() => handleIncrease(product._id)}
												disabled={!isAvailable}
											>
												<ShoppingCart className="w-4 h-4" /> Add to Cart
											</button>
										) : (
											<div className="space-y-2">
												<div className="flex items-center justify-between bg-gray-100 rounded-lg p-1 border border-gray-200">
													<button
														className="text-gray-600 hover:text-orange-600 transition-colors"
														onClick={() => handleDecrease(product._id)}
													>
														<AiFillMinusCircle size={28} />
													</button>
													<span className="font-bold text-gray-900">
														{currentQuantity}
													</span>
													<button
														className={`${currentQuantity < product.stock ? "text-gray-600 hover:text-orange-600" : "text-gray-300"} transition-colors`}
														onClick={() => handleIncrease(product._id)}
														disabled={currentQuantity >= product.stock}
													>
														<IoAddCircleSharp size={28} />
													</button>
												</div>
												<button
													className="w-full text-[11px] font-bold text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 uppercase py-1"
													onClick={() => handleReset(product._id)}
												>
													<GrPowerReset className="w-3 h-3" /> Clear Item
												</button>
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</main>
		</div>
	);
};

export default memo(BuyerHome);
