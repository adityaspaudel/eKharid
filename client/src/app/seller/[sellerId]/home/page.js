"use client";

import React, { useCallback, useEffect, useState } from "react";
import AddProducts from "@/components/addProducts";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function SellerHome() {
  const { sellerId } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productChange, setProductChange] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);

  // Fetch seller products
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

  // Toggle edit mode
  const handleEdit = (e, id) => {
    e.preventDefault();
    const product = products.find((p) => p._id === id);
    if (editingProductId === id) {
      setEditingProductId(null);
      setProductChange({
        title: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
      setSelectedImages([]);
    } else {
      setEditingProductId(id);
      setProductChange({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
      });
      setSelectedImages([]);
    }
  };

  const handleChange = (e) =>
    setProductChange({ ...productChange, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    if (Array.from(e.target.files).length <= 5) {
      setSelectedImages(Array.from(e.target.files));
    } else if (Array.from(e.target.files).length > 5) {
      alert("you cant save more than 5 images");
    }
  };

  // Save / update product
  const handleSaveAndUpdateProduct = useCallback(
    async (e, productId) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        Object.entries(productChange).forEach(([key, value]) =>
          formData.append(key, value)
        );
        selectedImages.forEach((file) => formData.append("images", file));

        const { data } = await axios.put(
          `http://localhost:8000/product/${productId}/updateProduct`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? data.updatedProduct : p))
        );

        setEditingProductId(null);
        setProductChange({
          title: "",
          description: "",
          price: "",
          category: "",
          stock: "",
        });
        setSelectedImages([]);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
    [productChange, selectedImages]
  );
  const handleDelete = useCallback(
    async (e, productId) => {
      e.preventDefault();
      try {
        const res = await axios.delete(
          `http://localhost:8000/product/${productId}/deleteProductById`
        );

        if (res.status === 200) {
          setProducts((prev) => prev.filter((p) => p._id !== productId));
          alert("Product deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    },
    [setProducts]
  );
  // handle logout
  const handleLogout = () => router.push("/login");

  return (
    <div className="bg-amber-50 text-black p-6 flex flex-col gap-4 w-full text-sm">
      <div className="flex justify-between items-center w-full ">
        <Image
          className="cursor-pointer"
          src="/eKharidLogo.png"
          alt="eKharidLogo"
          height={100}
          width={100}
        />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white cursor-pointer not-last:text-white px-4 py-2 rounded mt-6 shadow hover:shadow-red-600 hover:shadow-sm"
        >
          Logout
        </button>
      </div>
      <AddProducts sellerId={sellerId} />
      <h1 className="text-2xl font-bold w-full text-center">
        My Products List
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-600 mt-4">No products found.</p>
      ) : (
        <div className="flex flex-wrap gap-2 ">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-orange-100 hover:bg-amber-200 rounded-md shadow p-4 w-78 border-gray-600 hover:shadow-md"
            >
              {/* Product Images */}
              <div className="flex gap-2 overflow-x-auto mb-2">
                {product.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={`http://localhost:8000${img.imageUrl}`}
                    alt={`Product image ${idx + 1}`}
                    width={120}
                    height={120}
                    className="rounded object-cover border flex-shrink-0"
                  />
                ))}
              </div>

              {/* Product Details */}
              <div className="flex flex-col gap-0 text-sm mb-2">
                {["title", "description", "price", "category", "stock"].map(
                  (field) => (
                    <input
                      key={field}
                      value={product[field]}
                      disabled
                      className=" w-full"
                    />
                  )
                )}
              </div>
              <div className="flex justify-between items-center ">
                {/* Edit Button */}
                <button
                  onClick={(e) => handleEdit(e, product._id)}
                  disabled={
                    editingProductId && editingProductId !== product._id
                  }
                  className="px-2  rounded cursor-pointer hover:bg-amber-200 text-indigo-500"
                >
                  {editingProductId === product._id ? "Close" : "Edit"}
                </button>
                <button
                  onClick={(e) => handleDelete(e, product._id)}
                  className="text-sm hover:text-md cursor-pointer text-red-500 hover:bg-amber-200 px-2"
                >
                  delete
                </button>
              </div>

              {/* Edit Form */}
              {editingProductId === product._id && (
                <div className="bg-gray-200 p-4 rounded mt-3 flex flex-col">
                  {Object.keys(productChange).map((field) => (
                    <div
                      key={field}
                      className="flex text-sm justify-between items-center "
                    >
                      <label className="min-w-18 capitalize overflow-hidden">
                        {field}:
                      </label>
                      <input
                        name={field}
                        value={productChange[field]}
                        onChange={handleChange}
                        className="border-b   px-2 "
                      />
                    </div>
                  ))}

                  {/* Upload New Images */}
                  <div className="mt-3">
                    <label className="block font-medium mb-1">
                      Upload New Images:
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      className="w-full text-sm"
                    />
                    {selectedImages.length > 0 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto">
                        {selectedImages.map((file, idx) => (
                          <Image
                            key={idx}
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            width={60}
                            height={60}
                            className="rounded object-cover border flex-shrink-0"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Update / Cancel */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) =>
                        handleSaveAndUpdateProduct(e, product._id)
                      }
                      className="bg-indigo-600 text-white px-3 py-1 rounded"
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
      )}
    </div>
  );
}
