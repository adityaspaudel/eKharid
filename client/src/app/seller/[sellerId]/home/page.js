'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import AddProducts from '@/components/addProducts';
import { useParams } from 'next/navigation';
import axios from 'axios';

function SellerHome() {
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

  const fetchProducts = useCallback(async () => {
    if (!sellerId) return;
    try {
      const { data } = await axios.get(
        `http://localhost:8000/seller/${sellerId}/getProducts`
      );
      console.log('data:', data);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log('finished fetching');
    }
  }, [sellerId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (e, id) => {
    e.preventDefault();
    setEditingProductId(editingProductId === id ? null : id);
  };

  const handleChange = (e) => {
    setProductChange({ ...productChange, [e.target.name]: e.target.value });
  };

  const handleSaveAndUpdateProduct = useCallback(
    async (e, productId) => {
      e.preventDefault();
      try {
        const { data } = await axios.put(
          `http://localhost:8000/product/${productId}/updateProduct`,
          productChange,
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('updated, data:', data);
        fetchProducts(); // ✅ refresh list
        setEditingProductId(null);
      } catch (error) {
        console.error(error);
      }
    },
    [productChange, fetchProducts]
  );

  return (
    <div className="bg-amber-50 text-black">
      <AddProducts sellerId={sellerId} />
      <h1>My Product List</h1>
      {products.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {products.map((val) => (
            <div
              key={val._id}
              className="flex flex-col gap-2 p-4 bg-orange-100 rounded-sm shadow hover:shadow-md transition hover:shadow-gray-500"
            >
              <div className="flex gap-2 flex-wrap">
                <div className="flex flex-col gap-1">
                  <input value={val.title} disabled />
                  <input value={val.description} disabled />
                  <input value={val.price} disabled />
                  <input value={val.category} disabled />
                  <input value={val.stock} disabled />
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => handleEdit(e, val._id)}
                    className="cursor-pointer"
                  >
                    {editingProductId === val._id ? 'close' : 'edit'}
                  </button>
                </div>

                {editingProductId === val._id && (
                  <div className="bg-gray-200 p-2 rounded mt-2">
                    {Object.keys(productChange).map((field) => (
                      <div key={field} className="flex gap-2 mb-1">
                        <label>{field}:</label>
                        <input
                          name={field}
                          value={productChange[field]}
                          onChange={handleChange}
                          className="border p-1"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => handleSaveAndUpdateProduct(e, val._id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setEditingProductId(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(SellerHome);
