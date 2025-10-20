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
import { ShoppingCart, Info } from "lucide-react";
import { IoAddCircleSharp } from "react-icons/io5";
import { AiFillMinusCircle } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import Link from "next/link";

const IMAGE_BASE_URL = "http://localhost:8000";

const BuyerHome = () => {
  const { buyerId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Fetch all products
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
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  // Handle search
  const handleSearch = useCallback(async () => {
    if (!searchText.trim()) {
      // If search is empty, reload all products
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
      setProductsList(data); // update the product list with search results
    } catch (err) {
      console.error(err);
      setError("Failed to search products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [searchText, getAllProducts]);

  const handleChange = (e) => setSearchText(e.target.value);
  const handleLogout = () => router.push("/login");

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl font-semibold text-gray-600">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 text-red-600 bg-red-100 border border-red-400 rounded-lg max-w-xl">
          <p className="flex items-center gap-2 font-medium">
            <Info className="w-5 h-5" /> Error: {error}
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4 gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to eKharid</h1>

        <div className="flex gap-2 text-black">
          <input
            className="border border-black px-2 py-1 rounded"
            type="text"
            name="searchText"
            value={searchText}
            onChange={handleChange}
            placeholder="Search products..."
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
          >
            Search
          </button>
          <button
            onClick={() => {
              setSearchText("");
              getAllProducts();
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
          >
            Reset
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 shadow-md transition hover:shadow-lg text-white hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Product List */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
        {productsList.length === 0 && (
          <div className="text-center p-10 text-xl font-medium text-gray-500">
            No products found.
          </div>
        )}

        {productsList.map((product, index) => {
          const cartItem = cartItems.find((item) => item._id === product._id);
          const currentQuantity = cartItem ? cartItem.quantity : 0;
          const isAvailable = product.stock > 0;

          return (
            <div
              key={product._id}
              className="flex flex-col bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-gray-100 w-full sm:w-[48%] md:w-[30%] lg:w-[22%] xl:w-[18%]"
            >
              {/* Image */}
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
                  priority={index < 3}
                />
              </Link>

              {/* Info */}
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

                {/* Price + Stock */}
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

                {/* Cart Controls */}
                <div className="mt-4 flex flex-col gap-2">
                  {currentQuantity === 0 ? (
                    <button
                      className={`w-full py-2 flex items-center justify-center font-bold text-white rounded-lg transition-all ${
                        isAvailable
                          ? "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => dispatch(addToCart(product))}
                      disabled={!isAvailable}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xl w-full p-1 border border-indigo-200 rounded-lg">
                        <button
                          className={`transition ${
                            currentQuantity > 0
                              ? "text-indigo-600 hover:text-indigo-700"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          onClick={() =>
                            dispatch(decreaseQuantity(product._id))
                          }
                          disabled={currentQuantity <= 0}
                        >
                          <AiFillMinusCircle />
                        </button>
                        <span className="text-base font-semibold text-gray-800">
                          {currentQuantity} in Cart
                        </span>
                        <button
                          className={`transition ${
                            currentQuantity < product.stock
                              ? "text-indigo-600 hover:text-indigo-700"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          onClick={() =>
                            dispatch(increaseQuantity(product._id))
                          }
                          disabled={currentQuantity >= product.stock}
                        >
                          <IoAddCircleSharp />
                        </button>
                      </div>

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
    </div>
  );
};

export default memo(BuyerHome);
