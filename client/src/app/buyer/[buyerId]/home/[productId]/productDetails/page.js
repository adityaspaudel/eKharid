"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useState } from "react";

import { ShoppingCart, Package, Tag, Info } from "lucide-react";
import { IoAddCircleSharp } from "react-icons/io5";
import { AiFillMinusCircle } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";

const ProductDetails = () => {
	// Destructure parameters
	const { buyerId, productId } = useParams();
	const router = useRouter();

	// State variables
	const [loading, setLoading] = useState(false);
	const [specificProduct, setSpecificProduct] = useState(null);
	const [error, setError] = useState(null);
	const [mainImage, setMainImage] = useState(""); // State for the currently selected main image

	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

	// Memoized function to fetch product details
	const fetchProductDetails = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`${NEXT_PUBLIC_API_URL}/product/${productId}/getProductById`,
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setSpecificProduct(data);

			if (data?.product?.images?.length > 0) {
				setMainImage(`${data.product.images[0].imageUrl}`);
			}
		} catch (err) {
			console.error("Failed to fetch product: ", err);
			setError("Failed to load product details. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [productId]);

	useEffect(() => {
		fetchProductDetails();
	}, [fetchProductDetails]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-600">
				Loading product details...
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6 text-red-600 bg-red-100 border border-red-400 rounded-lg max-w-xl mx-auto mt-10">
				<p className="flex items-center gap-2 font-medium">
					<Info className="w-5 h-5" /> Error: {error}
				</p>
			</div>
		);
	}

	if (!specificProduct || !specificProduct.product) {
		return (
			<div className="flex justify-center items-center h-screen text-xl font-medium text-gray-500">
				Product not found.
			</div>
		);
	}

	const product = specificProduct.product;

	const goBack = () => router.back();

	// Determine current quantity for this buyer
	const buyerRecord = product.buyer?.find((b) => b.user === buyerId);
	const currentQuantity = buyerRecord ? buyerRecord.quantity : 0;
	const isAvailable = product.stock > 0;

	// Minimal API function for cart actions
	const updateCart = async (action) => {
		const urlMap = {
			add: `${NEXT_PUBLIC_API_URL}/product/${buyerId}/increaseQuantity`,
			increase: `${NEXT_PUBLIC_API_URL}/product/${buyerId}/increaseQuantity`,
			decrease: `${NEXT_PUBLIC_API_URL}/product/${buyerId}/decreaseQuantity`,
			reset: `${NEXT_PUBLIC_API_URL}/product/${buyerId}/resetQuantity`,
		};

		try {
			const res = await fetch(urlMap[action], {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId }),
			});
			if (!res.ok) throw new Error(`Failed to ${action} product`);
			const data = await res.json();
			setSpecificProduct((prev) => ({ ...prev, product: data.product }));
		} catch (err) {
			console.error(err);
			alert(`Cannot ${action} product. Maybe out of stock.`);
		}
	};

	return (
		<main className="container mx-auto p-4 md:p-8">
			<div className="bg-white shadow-xl rounded-2xl overflow-hidden p-6 md:flex md:space-x-8">
				<div>
					<button className="cursor-pointer" onClick={goBack} title="go back">
						⬅️
					</button>
				</div>

				{/* 1. Image Gallery Section */}
				<div className="md:w-1/2">
					{/* Main Image Display */}
					<div className="mb-4 aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
						{mainImage && (
							<div>
								<Image
									src={mainImage}
									alt={product.title}
									fill
									className="object-contain transition-transform duration-300 hover:scale-105"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
									priority
								/>
							</div>
						)}
					</div>

					{/* Thumbnail Gallery */}
					<div className="flex gap-3 overflow-x-auto pb-2">
						{product.images.map((img, ind) => {
							const fullImageUrl = `${img?.imageUrl}`;
							return (
								<div
									key={ind}
									className={`relative w-20 h-20 flex-shrink-0 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
										mainImage === fullImageUrl
											? "border-indigo-600 ring-2 ring-indigo-300"
											: "border-gray-200 hover:border-indigo-400"
									}`}
									onClick={() => setMainImage(fullImageUrl)}
								>
									<Image
										src={fullImageUrl}
										alt={`${product.title} image ${ind + 1}`}
										fill
										className="object-cover rounded-md"
										sizes="80px"
									/>
									{/* {fullImageUrl} */}
								</div>
							);
						})}
					</div>
				</div>

				{/* 2. Product Details Section */}
				<div className="md:w-1/2 mt-6 md:mt-0">
					<p className="text-sm font-semibold uppercase text-indigo-600 mb-2">
						{product.category}
					</p>
					<h1 className="text-4xl font-extrabold text-gray-900 mb-4">
						{product.title}
					</h1>

					{/* Price */}
					<div className="text-4xl font-bold text-green-600 mb-6">
						Rs. {product.price?.toLocaleString() || "N/A"}
					</div>

					{/* Description */}
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">
							About this item
						</h2>
						<p className="text-gray-600 leading-relaxed whitespace-pre-line">
							{product.description}
						</p>
					</div>

					{/* Key Details (Stock & Availability) */}
					<div className="space-y-3 mb-8">
						<div className="flex items-center text-gray-700">
							<Package className="w-5 h-5 mr-2 text-indigo-500" />
							<span className="font-semibold">Stock:</span>
							<span
								className={`ml-2 font-medium ${
									product.stock > 0 ? "text-green-600" : "text-red-600"
								}`}
							>
								{product.stock > 0
									? `${product.stock} in stock`
									: "Out of Stock"}
							</span>
						</div>

						<div className="flex items-center text-gray-700">
							<Tag className="w-5 h-5 mr-2 text-indigo-500" />
							<span className="font-semibold">Category:</span>
							<span className="ml-2 font-medium">{product.category}</span>
						</div>
					</div>

					{/* Cart Controls */}
					<div className="flex flex-col gap-3">
						{currentQuantity === 0 ? (
							<button
								className={`w-full py-3 px-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-300 ${
									isAvailable
										? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
										: "bg-gray-400 text-gray-700 cursor-not-allowed"
								}`}
								disabled={!isAvailable}
								onClick={() => updateCart("add")}
							>
								<ShoppingCart className="w-5 h-5 mr-2 cursor-pointer" />
								Add to Cart
							</button>
						) : (
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between text-xl w-full p-1 border border-indigo-200 rounded-lg">
									<button
										className={`transition cursor-pointer ${
											currentQuantity > 0
												? "text-indigo-600 hover:text-indigo-700"
												: "text-gray-400 cursor-not-allowed"
										}`}
										onClick={() => updateCart("decrease")}
										disabled={currentQuantity <= 0}
									>
										<AiFillMinusCircle />
									</button>
									<span className="text-base font-semibold text-gray-800">
										{currentQuantity} in Cart
									</span>
									<button
										className={`transition cursor-pointer ${
											currentQuantity < product.stock
												? "text-indigo-600 hover:text-indigo-700"
												: "text-gray-400 cursor-not-allowed"
										}`}
										onClick={() => updateCart("increase")}
										disabled={currentQuantity >= product.stock}
									>
										<IoAddCircleSharp />
									</button>
								</div>

								<button
									className="w-full py-2 flex items-center justify-center font-semibold cursor-pointer text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
									onClick={() => updateCart("reset")}
								>
									<GrPowerReset className="w-3 h-3 mr-2" />
									Remove All
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
};

export default memo(ProductDetails);
