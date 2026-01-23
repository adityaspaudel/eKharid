"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useState } from "react";

import { ShoppingCart, Package, Tag, Info, ArrowLeft } from "lucide-react";
import { IoAddCircleSharp } from "react-icons/io5";
import { AiFillMinusCircle } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";

const ProductDetails = () => {
	const { buyerId, productId } = useParams();
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [specificProduct, setSpecificProduct] = useState(null);
	const [error, setError] = useState(null);
	const [mainImage, setMainImage] = useState("");

	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

	const fetchProductDetails = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`${NEXT_PUBLIC_API_URL}/product/${productId}/getProductById`,
			);
			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`);
			const data = await response.json();
			setSpecificProduct(data);
			if (data?.product?.images?.length > 0) {
				setMainImage(`${data.product.images[0].imageUrl}`);
			}
		} catch (err) {
			setError("Failed to load product details.");
		} finally {
			setLoading(false);
		}
	}, [productId, NEXT_PUBLIC_API_URL]);

	useEffect(() => {
		fetchProductDetails();
	}, [fetchProductDetails]);

	if (loading)
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
			</div>
		);

	if (error || !specificProduct?.product)
		return (
			<div className="p-6 text-red-600 bg-red-50 border border-red-200 rounded-lg max-w-xl mx-auto mt-10 flex items-center gap-3">
				<Info className="w-5 h-5" /> {error || "Product not found."}
			</div>
		);

	const product = specificProduct.product;
	const buyerRecord = product.buyer?.find((b) => b.user === buyerId);
	const currentQuantity = buyerRecord ? buyerRecord.quantity : 0;
	const isAvailable = product.stock > 0;

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
			const data = await res.json();
			setSpecificProduct((prev) => ({ ...prev, product: data.product }));
		} catch (err) {
			alert("Action failed. Please check stock availability.");
		}
	};

	return (
		<main className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
			{/* Navigation */}
			<div className="container mx-auto mb-6">
				<button
					onClick={() => router.back()}
					className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-semibold transition-colors group"
				>
					<ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
					Back to Shop
				</button>
			</div>

			<div className="container mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
				<div className="flex flex-col md:flex-row">
					{/* 1. Image Gallery Section - Left Side */}
					<div className="md:w-1/2 p-6 md:p-10 bg-gray-50">
						<div className="aspect-square bg-white rounded-2xl shadow-inner border border-gray-200 overflow-hidden relative mb-6">
							{mainImage && (
								<Image
									src={mainImage}
									alt={product.title}
									fill
									className="object-contain p-4 transition-all duration-500"
									priority
								/>
							)}
						</div>

						<div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
							{product.images.map((img, ind) => (
								<button
									key={ind}
									onClick={() => setMainImage(img.imageUrl)}
									className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
										mainImage === img.imageUrl
											? "border-orange-600 scale-105 shadow-md"
											: "border-gray-200 opacity-70 hover:opacity-100"
									}`}
								>
									<Image
										src={img.imageUrl}
										alt="thumbnail"
										fill
										className="object-cover"
									/>
								</button>
							))}
						</div>
					</div>

					{/* 2. Content Section - Right Side */}
					<div className="md:w-1/2 p-6 md:p-12 flex flex-col">
						<div className="mb-2">
							<span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest">
								{product.category}
							</span>
						</div>

						<h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
							{product.title}
						</h1>

						<div className="flex items-baseline gap-4 mb-8">
							<span className="text-4xl font-black text-orange-600">
								Rs. {product.price?.toLocaleString()}
							</span>
							{isAvailable && (
								<span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-sm uppercase">
									In Stock
								</span>
							)}
						</div>

						<div className="space-y-6 mb-10">
							<div>
								<h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
									<Info className="w-5 h-5 text-orange-600" />
									Description
								</h3>
								<p className="text-gray-600 leading-relaxed text-lg">
									{product.description}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-gray-100 rounded-lg">
										<Package className="w-5 h-5 text-gray-600" />
									</div>
									<div>
										<p className="text-xs text-gray-400 font-bold uppercase">
											Stock
										</p>
										<p className="font-bold text-gray-900">
											{product.stock} units
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="p-2 bg-gray-100 rounded-lg">
										<Tag className="w-5 h-5 text-gray-600" />
									</div>
									<div>
										<p className="text-xs text-gray-400 font-bold uppercase">
											Category
										</p>
										<p className="font-bold text-gray-900">
											{product.category}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Cart Controls */}
						<div className="mt-auto">
							{currentQuantity === 0 ? (
								<button
									disabled={!isAvailable}
									onClick={() => updateCart("add")}
									className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl transition-all ${
										isAvailable
											? "bg-gray-900 text-white hover:bg-orange-600 hover:-translate-y-1 active:scale-95"
											: "bg-gray-300 text-gray-500 cursor-not-allowed"
									}`}
								>
									<ShoppingCart className="w-6 h-6" />
									Add to Cart
								</button>
							) : (
								<div className="space-y-4">
									<div className="flex items-center justify-between bg-gray-900 text-white rounded-2xl p-2 shadow-lg">
										<button
											className="p-3 text-orange-500 hover:text-white transition-colors"
											onClick={() => updateCart("decrease")}
										>
											<AiFillMinusCircle size={36} />
										</button>
										<div className="flex flex-col items-center">
											<span className="text-2xl font-black">
												{currentQuantity}
											</span>
											<span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
												In Cart
											</span>
										</div>
										<button
											className={`${currentQuantity < product.stock ? "text-orange-500 hover:text-white" : "text-gray-700"} p-3 transition-colors`}
											onClick={() => updateCart("increase")}
											disabled={currentQuantity >= product.stock}
										>
											<IoAddCircleSharp size={36} />
										</button>
									</div>
									<button
										className="w-full py-3 flex items-center justify-center gap-2 font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
										onClick={() => updateCart("reset")}
									>
										<GrPowerReset className="w-4 h-4" />
										Remove from Cart
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default memo(ProductDetails);
