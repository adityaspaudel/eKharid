"use client";

import React, { useCallback, useEffect, useState } from "react";
import AddProducts from "@/components/addProducts";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function SellerHome() {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [productChange, setProductChange] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);

  // ✅ Fetch products
  const fetchProducts = useCallback(async () => {
    if (!sellerId) return;
    try {
      const { data } = await axios.get(
        `http://localhost:8000/seller/${sellerId}/getProducts`
      );
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Handle edit button click
  const handleEdit = (e, id) => {
    e.preventDefault();
    const selectedProduct = products.find((p) => p._id === id);

    if (editingProductId === id) {
      // Close edit mode
      setEditingProductId(null);
      setProductChange({
        title: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
    } else {
      // Enter edit mode with product details
      setEditingProductId(id);
      setProductChange({
        title: selectedProduct.title,
        description: selectedProduct.description,
        price: selectedProduct.price,
        category: selectedProduct.category,
        stock: selectedProduct.stock,
      });
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    setProductChange({ ...productChange, [e.target.name]: e.target.value });
  };

  // ✅ Handle save/update product
  const handleSaveAndUpdateProduct = useCallback(
    async (e, productId) => {
      e.preventDefault();
      try {
        const { data } = await axios.put(
          `http://localhost:8000/product/${productId}/updateProduct`,
          productChange,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Product updated:", data);
        await fetchProducts(); // Refresh products
        setEditingProductId(null);
        setProductChange({
          title: "",
          description: "",
          price: "",
          category: "",
          stock: "",
        });
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
    [productChange, fetchProducts]
  );
  const router = useRouter();
  const handleLogout = () => {
    router.push("/login");
  };
  return (
    <div className="bg-amber-500 text-black  p-6 flex flex-col gap-2 w-full">
      <AddProducts sellerId={sellerId} />
      <h1 className="text-2xl font-bold mt-4 mb-2">My Product List</h1>

      <div className="flex  gap-2 content-center items-center flex-wrap">
        {products.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {products.map((val) => (
              <div
                key={val._id}
                className=" bg-orange-100 rounded-md shadow hover:shadow-md transition  w-48 h-80 border-0 overflow-scroll text-xs"
              >
                <div className="flex flex-col gap-2">
                  <Image
                    src={`http://localhost:8000${val.images[0].imageUrl}`}
                    alt={`Product ${val.images[0].imageUrl}`}
                    className="w-50 h-30 object-cover rounded border"
                    width={48}
                    height={48}
                  />

                  <div className="flex flex-col p-1">
                    <input value={val.title} disabled className="p-1 " />
                    <input value={val.description} disabled className=" p-1" />
                    <input value={val.price} disabled className=" p-1" />
                    <input value={val.category} disabled className=" p-1" />
                    <input value={val.stock} disabled className=" p-1" />
                  </div>
                  <div>
                    {/* ✅ Display product images */}
                    <div className="text-wrap break-all">
                      {/* {JSON.stringify(val.images)} */}
                    </div>
                    {val.images && val.images.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 overflow-scroll w-64">
                        {val.images.map((img, i) => (
                          <Image
                            key={i}
                            src={`http://localhost:8000${img?.imageUrl}`}
                            alt={`Product ${img?.imageUrl}`}
                            className="w-16 h-24 object-cover rounded border"
                            width={100}
                            height={100}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => handleEdit(e, val._id)}
                    disabled={editingProductId && editingProductId !== val._id}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    {editingProductId === val._id ? "Close" : "Edit"}
                  </button>
                </div>
                {editingProductId === val._id && (
                  <div className="bg-gray-200 p-3 rounded mt-3">
                    {Object.keys(productChange).map((field) => (
                      <div key={field} className="flex items-center gap-2 mb-2">
                        <label className="w-24 capitalize">{field}:</label>
                        <input
                          name={field}
                          value={productChange[field]}
                          onChange={handleChange}
                          className="border p-1 flex-1"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => handleSaveAndUpdateProduct(e, val._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setEditingProductId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No products found.</p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-400 shadow transition hover:shadow-md text-white hover:bg-red-500 px-2 rounded-sm"
      >
        logout
      </button>
    </div>
  );
}
