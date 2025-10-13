'use client';

import ProductUploadPage from '@/components/productUploadPage';
import { useParams } from 'next/navigation';
import React from 'react';

const SellerHome = () => {
  const { sellerId } = useParams();
  return (
    <div>
      <ProductUploadPage sellerId={sellerId} />
    </div>
  );
};

export default SellerHome;
