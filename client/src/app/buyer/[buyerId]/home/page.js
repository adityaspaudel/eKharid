"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/lib/redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react"; // Using lucide for consistency/modern look
import { IoAddCircleSharp } from "react-icons/io5";
import { AiFillMinusCircle } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import Link from "next/link";
import { Info } from "lucide-react"; // Added Info icon for errors

// Define the base URL once
const IMAGE_BASE_URL = "http://localhost:8000";

const BuyerHome = () => {
  const { buyerId } = useParams();
  const [productsList, setProductsList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state

  // redux
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const getAllProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${IMAGE_BASE_URL}/product/getAllProducts`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProductsList(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const router = useRouter();
  const handleLogout = () => {
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl font-semibold text-gray-600">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 text-red-600 bg-red-100 border border-red-400 rounded-lg max-w-xl">
          <p className="flex items-center gap-2 font-medium">
            <Info className="w-5 h-5" /> Error: {error}
          </p>
        </div>
      </div>
    );
  }

  const products = productsList?.products || [];

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* Header and Logout Button */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Buyer</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 shadow-md transition hover:shadow-lg text-white hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product, index) => {
          // Find the current quantity in the cart
          const cartItem = cartItems.find((item) => item._id === product._id);
          const currentQuantity = cartItem ? cartItem.quantity : 0;
          const isAvailable = product.stock > 0;

          return (
            <div
              key={product._id}
              className="flex flex-col bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-gray-100"
            >
              {/* Image Link */}
              <Link
                href={`/buyer/${buyerId}/home/${product._id}/productDetails`}
                className="block relative h-40"
              >
                <Image
                  className="object-cover"
                  alt={product?.title || "Product Image"}
                  src={`${IMAGE_BASE_URL}${product.images[0]?.imageUrl}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 200px"
                  // Only set priority for the first few items to optimize LCP
                  priority={index < 3}
                />
              </Link>

              {/* Product Info */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="mb-2">
                  <h3
                    className="font-bold text-lg text-gray-900 truncate"
                    title={product?.title}
                  >
                    {product?.title}
                  </h3>
                  <p className="text-sm text-indigo-600 font-semibold mt-1">
                    {product?.category}
                  </p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {product?.description}
                  </p>
                </div>

                {/* Price and Stock */}
                <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-gray-100">
                  <div className="font-extrabold text-lg text-green-600">
                    Rs.{product?.price?.toLocaleString() || "N/A"}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isAvailable ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isAvailable ? `${product.stock} in stock` : "Out of Stock"}
                  </div>
                </div>

                {/* Cart Action Buttons */}
                <div className="mt-4 flex flex-col gap-2">
                  {currentQuantity === 0 ? (
                    // Add to Cart Button
                    <button
                      className={`w-full py-2 flex items-center justify-center font-bold text-white rounded-lg transition-all ${
                        isAvailable
                          ? "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        isAvailable && dispatch(addToCart(product))
                      }
                      disabled={!isAvailable}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  ) : (
                    // Quantity Control and Reset
                    <div className="flex flex-col gap-2">
                      {/* Quantity Control Row */}
                      <div className="flex items-center justify-between text-xl w-full p-1 border border-indigo-200 rounded-lg">
                        <button
                          className="text-indigo-600 hover:text-indigo-700 transition"
                          onClick={() =>
                            dispatch(decreaseQuantity(product._id))
                          }
                          disabled={!isAvailable || currentQuantity <= 0}
                        >
                          <AiFillMinusCircle />
                        </button>
                        <span className="text-base font-semibold text-gray-800">
                          {currentQuantity} in Cart
                        </span>
                        <button
                          className="text-indigo-600 hover:text-indigo-700 transition"
                          onClick={() =>
                            isAvailable && dispatch(increaseQuantity(product))
                          }
                          disabled={
                            !isAvailable || currentQuantity >= product.stock
                          }
                        >
                          <IoAddCircleSharp />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        className="w-full py-2 flex items-center justify-center font-semibold text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                        onClick={() => dispatch(removeFromCart(product._id))}
                      >
                        <GrPowerReset className="w-3 h-3 mr-2" />
                        Remove All
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && !isLoading && (
        <div className="text-center p-10 text-xl font-medium text-gray-500">
          No products found.
        </div>
      )}
    </div>
  );
};

export default memo(BuyerHome);
