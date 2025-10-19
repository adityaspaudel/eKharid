"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { memo, useCallback, useEffect, useState } from "react";
// Assuming you have a way to get these icons, e.g., using 'lucide-react' or a custom SVG component
// For this example, we'll import them conceptually.
import { ShoppingCart, Package, Tag, Info } from "lucide-react";

const ProductDetails = () => {
  // Destructure parameters
  const { buyerId, productId } = useParams();

  // State variables
  const [loading, setLoading] = useState(false);
  const [specificProduct, setSpecificProduct] = useState(null);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(""); // State for the currently selected main image

  // Define the base URL once
  const imageBaseUrl = "http://localhost:8000";

  // Memoized function to fetch product details
  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${imageBaseUrl}/product/${productId}/getProductById`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSpecificProduct(data);

      // Set the first image as the main image once data is loaded
      if (data?.product?.images?.length > 0) {
        setMainImage(`${imageBaseUrl}${data.product.images[0].imageUrl}`);
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

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-6 md:flex md:space-x-8">
        {/* 1. Image Gallery Section */}
        <div className="md:w-1/2">
          {/* Main Image Display */}
          <div className="mb-4 aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-contain transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                priority
              />
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, ind) => {
              const fullImageUrl = `${imageBaseUrl}${img?.imageUrl}`;
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

          {/* Action Button (Add to Cart) */}
          <button
            className={`w-full py-3 px-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-300 ${
              product.stock > 0
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.stock > 0 ? "Add to Cart" : "Currently Unavailable"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default memo(ProductDetails);
