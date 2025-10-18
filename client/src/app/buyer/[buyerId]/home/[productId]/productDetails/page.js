"use client";

import { useParams } from "next/navigation";
import React, { memo } from "react";

const ProductDetails = () => {
  const { buyerId, productId } = useParams();

  console.log("buyerId: ", buyerId);
  console.log("productId: ", productId);
  return (
    <main>
      <h1>Product Details</h1>
      <div></div>
    </main>
  );
};

export default memo(ProductDetails);
