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
import { FaCartShopping } from "react-icons/fa6";
import { IoAddCircleSharp } from "react-icons/io5";
import { AiFillMinusCircle } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import Link from "next/link";

const BuyerHome = () => {
  const { buyerId } = useParams();
  const [productsList, setProductsList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // redux
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

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
        <div className="flex  gap-2 flex-wrap text-xs relative">
          {productsList.products.map((value, index) => (
            <div
              key={value._id}
              className="flex flex-col bg-amber-300 w-48 h-80 overflow-hidden"
            >
              <Link href={`/buyer/${buyerId}/home/${value._id}/productDetails`}>
                <Image
                  className="object-cover h-24 w-64"
                  alt="image"
                  src={`http://localhost:8000${value.images[0].imageUrl}`}
                  width={100}
                  height={100}
                />
              </Link>
              <div className="p-2 bg-red-400">
                <div className="font-bold">{value?.title}</div>
                <div className="flex  justify-between items-center w-full border-b-1">
                  <div>Rs.{value?.price}</div>
                  <div>{value?.stock} units</div>
                </div>
                <div>{value?.description}</div>

                {/* <div>{value?.category}</div>

                <div>{value?.seller}</div> */}
              </div>

              <div className="flex gap-2  hover:overflow-x-auto ">
                {value?.images.map((v, i) => (
                  <div
                    key={v._id}
                    className="snap-start flex-shrink-0 relative"
                  >
                    <Image
                      className="object-cover rounded-md"
                      src={`http://localhost:8000${v?.imageUrl}`}
                      alt={`${value?.title}${i}`}
                      title={`${value?.title}${i}`}
                      width={100}
                      height={100}
                    />
                  </div>
                ))}
              </div>
              <div className="">
                <div className="flex gap-2 text-xl absolute bottom-0 ">
                  <button
                    className="flex gap-2 hover:cursor-pointer bg bg-green-400 px-2 rounded-sm text-emerald-100"
                    onClick={() => dispatch(addToCart)}
                  >
                    <FaCartShopping />{" "}
                    <span className="text-xs">Add to cart</span>
                  </button>
                  <button
                    className="text-green-400"
                    onClick={() => dispatch(increaseQuantity)}
                  >
                    <IoAddCircleSharp />
                  </button>
                  <button
                    className="text-red-400"
                    onClick={() => dispatch(decreaseQuantity)}
                  >
                    <AiFillMinusCircle />
                  </button>{" "}
                  <button
                    className="text-black"
                    onClick={() => dispatch(removeFromCart)}
                  >
                    <GrPowerReset />
                  </button>
                </div>
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
