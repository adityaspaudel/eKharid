'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AddProducts from '@/components/addProducts';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function SellerHome() {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [productChange, setProductChange] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
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
      console.error('Error fetching products:', error);
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
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
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
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('Product updated:', data);
        await fetchProducts(); // Refresh products
        setEditingProductId(null);
        setProductChange({
          title: '',
          description: '',
          price: '',
          category: '',
          stock: '',
        });
      } catch (error) {
        console.error('Error updating product:', error);
      }
    },
    [productChange, fetchProducts]
  );

  return (
    <div className="bg-amber-50 text-black min-h-screen p-6">
      <AddProducts sellerId={sellerId} />
      <h1 className="text-2xl font-bold mt-4 mb-2">My Product List</h1>

      {products.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {products.map((val) => (
            <div
              key={val._id}
              className="p-4 bg-orange-100 rounded-md shadow hover:shadow-md transition"
            >
              <div className="flex flex-col gap-2">
                <input value={val.title} disabled className="border p-1" />
                <input
                  value={val.description}
                  disabled
                  className="border p-1"
                />
                <input value={val.price} disabled className="border p-1" />
                <input value={val.category} disabled className="border p-1" />
                <input value={val.stock} disabled className="border p-1" />
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => handleEdit(e, val._id)}
                  disabled={editingProductId && editingProductId !== val._id}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  {editingProductId === val._id ? 'Close' : 'Edit'}
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
  );
}
