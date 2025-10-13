'use client';

import React, { useEffect, useState } from 'react';
import AddProducts from '@/components/addProducts';
import { useParams } from 'next/navigation';
import axios from 'axios';

const SellerHome = () => {
  const { sellerId } = useParams();
  // console.log(sellerId);
  const [products, setProducts] = useState(null);

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
        setProducts('');
      }
    };

    if (sellerId) {
      fetchProducts();
    }
  });

  return (
    <div className="bg-amber-50 text-black">
      <AddProducts sellerId={sellerId} />
      {JSON.stringify(products, 2, 2)}{' '}
    </div>
  );
};

export default SellerHome;
