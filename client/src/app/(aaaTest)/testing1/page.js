"use client";
import {
  decrement,
  increment,
  incrementByAmount,
  reset,
} from "@/lib/redux/slices/counterSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Counter = () => {
  const value = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col items-center content-center bg-amber-50 text-black h-screen w-screen">
      <div className="font-bold text-2xl">Counter</div>

      <button
        className="hover:cursor-pointer"
        onClick={() => dispatch(increment())}
      >
        increment
      </button>
      <button
        className="hover:cursor-pointer"
        onClick={() => dispatch(decrement())}
      >
        decrement
      </button>
      <button
        className="hover:cursor-pointer"
        onClick={() => dispatch(incrementByAmount())}
      >
        incrementByAmount
      </button>
      <button
        className="hover:cursor-pointer"
        onClick={() => dispatch(reset())}
      >
        reset
      </button>

      <div>{value}</div>
    </div>
  );
};

export default Counter;
