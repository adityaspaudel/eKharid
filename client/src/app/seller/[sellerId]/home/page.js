'use client';

import React, { useEffect, useState } from 'react';
import AddProducts from '@/components/addProducts';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const SellerHome = () => {
  const { sellerId } = useParams();
  // console.log(sellerId);
  const [products, setProducts] = useState(null);
  const [productChange, setProductChange] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [editingProductId, setEditingProductId] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/seller/${sellerId}/getProducts`
        );
        console.log('data: ', data);

        setProducts(data);
      } catch (error) {
      } finally {
        console.log('finished fetching');
      }
    };

    if (sellerId) {
      fetchProducts();
    }
  }, [sellerId]);
  // update products
  // const editProductAPI = (productId) => {};

  const handleEdit = (id) => {
    setEditingProductId(id);
  };
  const handleChange = (e, id) => {
    setProductChange({ ...productChange, [e.target.name]: e.target.value });
  };

  const handleSaveAndUpdateProduct = (productId) => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.put(
          `http://localhost:8000/product/${productId}/updateProduct`,
          {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productChange),
          }
        );
        console.log('updated,data: ', data);
      } catch (error) {}
    };
    console.log('productId: ', productId);
    fetchProducts();
  };

  const updateProduct = () => {};
  const deleteProduct = () => {};
  return (
    <div className="bg-amber-50 text-black">
      <AddProducts sellerId={sellerId} />
      <div>
        {' '}
        <h1>My Product List</h1>
        {products !== null && (
          <div className="flex gap-2 ">
            {products.map((val, ind) => (
              <div
                key={ind}
                className="flex flex-col gap-2 p-4  bg-orange-100 rounded-sm shadow hover:shadow-md transition hover:shadow-gray-500"
              >
                <div>
                  <div>
                    <div className="flex gap-2">
                      <label htmlFor="">title:</label>{' '}
                      <input value={val?.title} disabled />
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="">description:</label>{' '}
                      <input value={val?.description} disabled />
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="">price:</label>{' '}
                      <input value={val?.price} disabled />
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="">category:</label>{' '}
                      <input value={val?.category} disabled />
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="">stock:</label>
                      <input value={val?.stock} disabled />
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="">seller:</label>{' '}
                      <input val={val?.seller} disabled />
                    </div>
                    <div className="flex gap-2 ">
                      <button
                        onClick={() => handleEdit(val._id)}
                        className="cursor-pointer"
                      >
                        edit
                      </button>
                      <button className="cursor-pointer">delete</button>
                    </div>

                    {/* edit products  */}

                    <div className="bg-gray-400">
                      {val._id == editingProductId ? (
                        <div>
                          <div className="font-black">
                            edit product{editingProductId}
                          </div>
                          <div className="flex gap-2">
                            <label htmlFor="">title:</label>{' '}
                            <input
                              name="title"
                              value={productChange.title}
                              onChange={(e) => handleChange(e, val?.title)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <label htmlFor="">description:</label>{' '}
                            <input
                              name="description"
                              value={productChange.description}
                              onChange={(e) =>
                                handleChange(e, val?.description)
                              }
                            />
                          </div>
                          <div className="flex gap-2">
                            <label htmlFor="">price:</label>{' '}
                            <input
                              name="price"
                              value={productChange.price}
                              onChange={(e) => handleChange(e, val?.price)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <label htmlFor="">category:</label>{' '}
                            <input
                              name="category"
                              value={productChange.category}
                              onChange={(e) => handleChange(e, val?.category)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <label htmlFor="">stock:</label>
                            <input
                              name="stock"
                              value={productChange.stock}
                              onChange={(e) => handleChange(e, val?.stock)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <label htmlFor="">seller:</label>{' '}
                            <input val={val?.seller} disabled />
                          </div>
                          <div className="flex gap-2 ">
                            <button
                              onClick={handleSaveAndUpdateProduct(
                                editingProductId
                              )}
                            >
                              update
                            </button>
                            <button>cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <pre>{JSON.stringify(products, 2, 2)}</pre>
    </div>
  );
};

export default SellerHome;
