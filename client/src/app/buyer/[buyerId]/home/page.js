"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const BuyerHome = () => {
  const { buyerId } = useParams();
  const [productsList, setProductsList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAllProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/product/getAllProducts"
      );

      const data = await response.json();
      console.log("All products fetched:", data);

      setProductsList(data);
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
    <div className="bg-white min-h-screen w-screen text-black">
      {/* <div> {buyerId}</div> */}

      {productsList && (
        <div className="flex gap-2 flex-wrap w-64">
          {productsList.products.map((value, index) => (
            <div key={value._id} className="bg-amber-300  ">
              <div className="font-bold">{value?.title}</div>
              <div>{value?.description}</div>
              <div>{value?.price}</div>
              <div>{value?.category}</div>
              <div>{value?.seller}</div>
              <div className="flex  gap-2 snap-x scroll-pl-48 w-full">
                {value?.images.map((v, i) => (
                  <div key={v._id} className="object-cover w-20 h-30">
                    <Image
                      className="object-cover"
                      src={`http://localhost:8000${v?.imageUrl}`}
                      alt="image"
                      height={120}
                      width={80}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white text-black">
        {/* {JSON.stringify(productsList)} */}

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
