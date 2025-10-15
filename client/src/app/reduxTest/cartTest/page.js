'use client';

import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '@/lib/redux/slices/cartSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import {

//   addToCart,
//   removeFromCart,
//   increaseQuantity,
//   decreaseQuantity,
// } from './app/store';

const products = [
  { id: 1, title: 'T-shirt', price: 200 },
  { id: 2, title: 'Shoes', price: 500 },
  { id: 3, title: 'Watch', price: 800 },
];

export default function AppContent() {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center py-4 bg-blue-500 text-white">
        Redux Cart App 🛒
      </h1>

      <div className="grid grid-cols-2 p-6 gap-6">
        {/* --- Product List --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-1 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="border rounded-xl p-4 flex justify-between items-center shadow-sm"
              >
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-gray-600">Rs.{p.price}</p>
                </div>
                <button
                  onClick={() => dispatch(addToCart(p))}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- Cart Section --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            <>
              <ul>
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <span>{item.title}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        className="px-2 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="px-2 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                    <span>${item.price * item.quantity}</span>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-red-500 ml-3"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="text-right mt-4 font-bold text-lg">
                Total: Rs.{totalAmount}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
