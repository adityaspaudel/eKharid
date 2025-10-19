"use client";

import { useParams } from "next/navigation";
import React, { memo, useCallback, useEffect, useState } from "react";

const ProductDetails = () => {
  const { buyerId, productId } = useParams();
  const [loading, setLoading] = useState(false);
  console.log("buyerId: ", buyerId);
  console.log("productId: ", productId);

  const [specificProduct, setSpecificProduct] = useState([]);
  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/product/${productId}/getProductById`
      );
      const data = await response.json();
      console.log(response);
      if (!response.ok) {
        throw new Error("response was not ok");
      }
      setSpecificProduct(data);
    } catch (error) {
      console.error("failed to fetch product: ", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  return (
    <main>
      <h1>Product Details</h1>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          {specificProduct && <div>{JSON.stringify(specificProduct)}</div>}
        </div>
      )}
    </main>
  );
};

export default memo(ProductDetails);
