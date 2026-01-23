"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Package, Calendar, ChevronLeft, CreditCard, Hash } from "lucide-react";

const MyOrders = () => {
	const { buyerId } = useParams();
	const router = useRouter();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");

	const fetchOrders = useCallback(async () => {
		try {
			setLoading(true);
			const res = await fetch(
				`http://localhost:8000/product/${buyerId}/getOrders`,
			);
			if (!res.ok) throw new Error("Failed to fetch orders");

			const data = await res.json();
			const structuredOrders = (data.orders || []).map((order, idx) => ({
				...order,
				items: [order],
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
			<div className="flex flex-col justify-center items-center h-screen bg-white">
				<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-600 mb-4"></div>
				<p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
					Fetching your history
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#FDFDFD] pb-12">
			{/* Header Section */}
			<header className="bg-gray-900 text-white py-10 px-6">
				<div className="max-w-6xl mx-auto">
					<button
						onClick={() => router.back()}
						className="flex items-center gap-2 text-orange-500 hover:text-white transition-colors mb-4 font-bold text-sm uppercase tracking-wider"
					>
						<ChevronLeft size={18} /> Back to Store
					</button>
					<div className="flex items-center justify-between">
						<h1 className="text-4xl font-black">My Orders</h1>
						<Package size={40} className="text-orange-600 opacity-50" />
					</div>
					<p className="text-gray-400 mt-2">
						Manage and track your recent purchases
					</p>
				</div>
			</header>

			<div className="max-w-6xl mx-auto p-6 -mt-8">
				{message && (
					<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 font-bold rounded-r-lg">
						{message}
					</div>
				)}

				{!orders.length ? (
					<div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
						<div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
							<Package size={32} className="text-gray-300" />
						</div>
						<h2 className="text-2xl font-bold text-gray-800">
							No orders found
						</h2>
						<p className="text-gray-500 mt-2 mb-8">
							It looks like you haven't placed any orders yet.
						</p>
						<button
							onClick={() => router.push(`/buyer/${buyerId}/home`)}
							className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
						>
							Start Shopping
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{orders.map((order) => (
							<div
								key={order.uniqueKey}
								className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
							>
								{/* Order Meta Info */}
								<div className="p-5 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-3">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-gray-900 rounded-lg text-orange-500">
											<Hash size={16} />
										</div>
										<div>
											<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
												Order ID
											</p>
											<p className="text-sm font-black text-gray-900 truncate w-40">
												{order._id}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="p-2 bg-orange-100 rounded-lg text-orange-600">
											<Calendar size={16} />
										</div>
										<div>
											<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
												Date
											</p>
											<p className="text-sm font-bold text-gray-900">
												{new Date(order.purchaseDate).toLocaleDateString()}
											</p>
										</div>
									</div>
								</div>

								{/* Items List */}
								<div className="p-5 space-y-6 flex-grow">
									{order.items.map((item, idx) => (
										<div
											key={`${order.uniqueKey}-${idx}`}
											className="flex gap-5"
										>
											<div className="w-20 h-20 relative flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
												<Image
													src={item.images[0]?.imageUrl}
													alt={item.title}
													fill
													className="object-cover"
												/>
											</div>
											<div className="flex-1">
												<h3 className="font-black text-gray-900 leading-tight mb-1">
													{item.title}
												</h3>
												<div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-400">
													<span>Qty: {item.quantity}</span>
													<span>•</span>
													<span>Rs.{item.price.toLocaleString()}</span>
												</div>
												<p className="text-orange-600 font-black mt-2">
													Subtotal: Rs.
													{(item.price * item.quantity).toLocaleString()}
												</p>
											</div>
										</div>
									))}
								</div>

								{/* Footer / Total */}
								<div className="p-5 bg-gray-900 flex items-center justify-between">
									<div className="flex items-center gap-2 text-white">
										<CreditCard size={18} className="text-orange-500" />
										<span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
											Total Paid
										</span>
									</div>
									<div className="text-2xl font-black text-white">
										<span className="text-orange-500 text-sm mr-1">Rs.</span>
										{order.items
											.reduce(
												(sum, item) => sum + item.price * item.quantity,
												0,
											)
											.toLocaleString()}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MyOrders;
