"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const MyOrders = () => {
	const { buyerId } = useParams();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");

	// Fetch Orders
	const fetchOrders = useCallback(async () => {
		try {
			setLoading(true);
			const res = await fetch(
				`http://localhost:8000/product/${buyerId}/getOrders`
			);
			if (!res.ok) throw new Error("Failed to fetch orders");

			const data = await res.json();
			// Wrap each product as a single-item order to keep the same structure
			const structuredOrders = (data.orders || []).map((order, idx) => ({
				...order,
				items: [order], // put the product inside an items array
				uniqueKey: `${order._id}-${order.purchaseDate}-${idx}`,
			}));
			setOrders(structuredOrders);
		} catch (error) {
			console.error("Error fetching orders:", error);
			setMessage("❌ Failed to load orders.");
		} finally {
			setLoading(false);
		}
	}, [buyerId]);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64 text-gray-500">
				Loading your orders...
			</div>
		);
	}

	if (!orders.length) {
		return (
			<div className="flex justify-center items-center h-64 text-gray-500">
				You have no orders yet.
			</div>
		);
	}

	return (
		<div className="p-6 min-h-screen bg-gray-50">
			<h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
				📦 My Orders
			</h1>

			{message && (
				<div className="text-center mb-4 font-medium text-red-600">
					{message}
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{orders.map((order) => (
					<div
						key={order.uniqueKey} // ✅ unique key for each order
						className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
					>
						{/* Order Header */}
						<div className="p-4 border-b">
							<h2 className="font-semibold text-gray-800">
								Order ID: {order._id}
							</h2>
							<p className="text-gray-500 text-sm">
								Purchased on:{" "}
								{new Date(order.purchaseDate).toLocaleDateString()}
							</p>
						</div>

						{/* Order Items */}
						<div className="p-4 space-y-3">
							{order.items.map((item, idx) => (
								<div
									key={`${order.uniqueKey}-${idx}`} // ✅ unique key per item
									className="flex items-center gap-4 border-b pb-2"
								>
									<div className="w-16 h-16 relative flex-shrink-0">
										<Image
											src={`http://localhost:8000${item.images[0]?.imageUrl}`}
											alt={item.title}
											fill
											className="object-cover rounded"
										/>
									</div>
									<div className="flex-1">
										<p className="font-semibold text-gray-800">{item.title}</p>
										<p className="text-gray-500 text-sm">
											Qty: {item.quantity}
										</p>
										<p className="text-gray-500 text-sm">
											Price: Rs.{item.price}
										</p>
										<p className="text-gray-600 font-medium">
											Subtotal: Rs.{item.price * item.quantity}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Total Amount */}
						<div className="p-4 border-t text-right font-semibold text-gray-800">
							Total: Rs.
							{order.items.reduce(
								(sum, item) => sum + item.price * item.quantity,
								0
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default MyOrders;
