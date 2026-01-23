"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const MyCart = () => {
	const { buyerId } = useParams();
	const router = useRouter();
	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [myCartItems, setMyCartItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");

	// Fetch Cart Items
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
	}, [buyerId]);

	useEffect(() => {
		fetchCartItems();
	}, [fetchCartItems]);

	// Place Order
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

				// Redirect to My Orders after short delay
				setTimeout(() => {
					router.push(`/buyer/${buyerId}/home/myOrders`);
				}, 1500);
			} else {
				setMessage(`❌ ${data.message}`);
			}
		} catch (error) {
			console.error("Error placing order:", error);
			setMessage("❌ Failed to place order.");
		}
	};

	// Loading state
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64 text-gray-500">
				Loading your cart...
			</div>
		);
	}

	if (!myCartItems.length) {
		return (
			<div className="flex justify-center items-center h-64 text-gray-500">
				Your cart is empty 🛒
			</div>
		);
	}

	return (
		<div className="p-6 min-h-screen bg-gray-50">
			<h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
				🛒 My Cart
			</h1>

			{message && (
				<div
					className={`text-center mb-4 font-medium ${
						message.includes("✅") ? "text-green-600" : "text-red-600"
					}`}
				>
					{message}
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{myCartItems.map((item) => (
					<div
						key={item._id}
						className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
					>
						{/* Product Image */}
						<div className="relative w-full h-56">
							<Image
								src={`${item.images[0]?.imageUrl}`}
								alt={item.title}
								fill
								className="object-cover"
							/>
						</div>

						{/* Product Details */}
						<div className="p-4">
							<h2 className="text-lg font-semibold text-gray-800">
								{item.title}
							</h2>
							<p className="text-gray-600 mt-1">Price: Rs.{item.price}</p>
							<p className="text-gray-600">Quantity: {item.quantity}</p>
							<p className="text-sm text-gray-400 mt-1">
								Purchased: {new Date(item.purchaseDate).toLocaleDateString()}
							</p>
							<p className="mt-2 font-semibold text-gray-800">
								Subtotal: Rs.{item.price * item.quantity}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Total Summary */}
			<div className="mt-10 text-right pr-4">
				<h2 className="text-xl font-semibold text-gray-800">
					Total: Rs.
					{myCartItems.reduce(
						(sum, item) => sum + item.price * item.quantity,
						0,
					)}
				</h2>
				<button
					onClick={placeAnOrder}
					className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
				>
					Place Order
				</button>
			</div>
		</div>
	);
};

export default MyCart;
