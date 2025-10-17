"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const BuyerHome = () => {
  const { buyerId } = useParams();
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAllProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/product/getAllProducts"
      );

      const data = await response.data;
      console.log("All products fetched:", data);

      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(buyerId);
    getAllProducts();
  }, [buyerId, getAllProducts]);

  const router = useRouter();
  const handleLogout = () => {
    router.push("/login");
  };
  return (
    <div>
      <div className="bg-white h-screen w-screen text-black"> {buyerId}</div>

      <div className="bg-white text-black">
        {products !== null && <div>{JSON.stringify(products, 2, 2)}</div>}

        {products?.message}
        <button
          onClick={handleLogout}
          className="bg-red-400 shadow transition hover:shadow-md text-white hover:bg-red-500 px-2 rounded-sm"
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default memo(BuyerHome);
