"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
	ArrowLeft,
	Trash2,
	ShoppingBag,
	CheckCircle,
	AlertCircle,
} from "lucide-react";

const MyCart = () => {
	const { buyerId } = useParams();
	const router = useRouter();
	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [myCartItems, setMyCartItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");

	const fetchCartItems = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`${NEXT_PUBLIC_API_URL}/product/${buyerId}/fetchCartItems`,
			);
			if (!response.ok) throw new Error("API request failed");
			const data = await response.json();
			setMyCartItems(data.cartItems || []);
		} catch (error) {
			console.error("❌ Error fetching cart items:", error);
		} finally {
			setLoading(false);
		}
	}, [buyerId, NEXT_PUBLIC_API_URL]);

	useEffect(() => {
		fetchCartItems();
	}, [fetchCartItems]);

	const placeAnOrder = async () => {
		try {
			if (!myCartItems.length) return;
			const items = myCartItems.map((item) => ({
				productId: item._id,
				quantity: item.quantity,
			}));

			const response = await fetch(
				`${NEXT_PUBLIC_API_URL}/product/${buyerId}/placeOrder`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ items }),
				},
			);

			const data = await response.json();
			if (response.ok) {
				setMessage("✅ Order placed successfully!");
				setTimeout(() => {
					router.push(`/buyer/${buyerId}/home/myOrders`);
				}, 1500);
			} else {
				setMessage(`❌ ${data.message}`);
			}
		} catch (error) {
			setMessage("❌ Failed to place order.");
		}
	};

	const calculateTotal = () =>
		myCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

	if (loading) {
		return (
			<div className="flex flex-col justify-center items-center h-screen bg-white">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-600 mb-4"></div>
				<p className="text-gray-500 font-medium">Securing your items...</p>
			</div>
		);
	}

	if (!myCartItems.length) {
		return (
			<div className="flex flex-col justify-center items-center h-screen bg-gray-50 p-6 text-center">
				<div className="bg-white p-8 rounded-full shadow-sm mb-6">
					<ShoppingBag className="w-16 h-16 text-gray-300" />
				</div>
				<h2 className="text-2xl font-bold text-gray-800 mb-2">
					Your cart is feeling light
				</h2>
				<p className="text-gray-500 mb-8 max-w-xs">
					Looks like you hasn't added anything to your cart yet.
				</p>
				<button
					onClick={() => router.back()}
					className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg"
				>
					Go Shopping
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f8f8f8] pb-24">
			{/* Top Navigation */}
			<div className="bg-white border-b sticky top-0 z-10 px-6 py-4">
				<div className="max-w-5xl mx-auto flex items-center justify-between">
					<button
						onClick={() => router.back()}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<ArrowLeft className="w-6 h-6 text-gray-900" />
					</button>
					<h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
						Shopping Cart ({myCartItems.length})
					</h1>
					<div className="w-10"></div> {/* Spacer */}
				</div>
			</div>

			<div className="max-w-5xl mx-auto p-6">
				{message && (
					<div
						className={`flex items-center justify-center gap-2 p-4 rounded-xl mb-6 border ${
							message.includes("✅")
								? "bg-green-50 border-green-200 text-green-700"
								: "bg-red-50 border-red-200 text-red-700"
						}`}
					>
						{message.includes("✅") ? (
							<CheckCircle className="w-5 h-5" />
						) : (
							<AlertCircle className="w-5 h-5" />
						)}
						<span className="font-bold">{message}</span>
					</div>
				)}

				<div className="grid grid-cols-1 gap-4">
					{myCartItems.map((item) => (
						<div
							key={item._id}
							className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
								<Image
									src={item.images[0]?.imageUrl}
									alt={item.title}
									fill
									className="object-cover"
								/>
							</div>

							<div className="flex flex-col justify-between flex-grow">
								<div>
									<div className="flex justify-between items-start">
										<h2 className="text-lg font-bold text-gray-900 leading-tight">
											{item.title}
										</h2>
										<button className="text-gray-300 hover:text-red-500 transition-colors p-1">
											<Trash2 className="w-5 h-5" />
										</button>
									</div>
									<p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-wider">
										Qty: {item.quantity} × Rs.{item.price.toLocaleString()}
									</p>
								</div>

								<div className="flex justify-between items-end mt-4">
									<span className="text-xs text-gray-400 italic">
										Added {new Date(item.purchaseDate).toLocaleDateString()}
									</span>
									<p className="text-lg font-black text-gray-900">
										Rs.{(item.price * item.quantity).toLocaleString()}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* BOTTOM SUMMARY BAR */}
			<div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
				<div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="text-center sm:text-left">
						<p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">
							Total Amount
						</p>
						<h2 className="text-3xl font-black text-white">
							<span className="text-orange-500 mr-2">Rs.</span>
							{calculateTotal().toLocaleString()}
						</h2>
					</div>

					<button
						onClick={placeAnOrder}
						className="w-full sm:w-auto px-12 py-4 bg-orange-600 text-white text-lg font-black rounded-2xl hover:bg-orange-700 hover:-translate-y-1 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
					>
						Place Order
						<CheckCircle className="w-6 h-6" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default MyCart;
