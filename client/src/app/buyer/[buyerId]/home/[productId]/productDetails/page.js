"use client";

import Image from "next/image";
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
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          {specificProduct && (
            <div>
              <div>
                <h1>{specificProduct?.product?.title}</h1>
                <div>{specificProduct?.product?.description}</div>{" "}
                <div>Rs.{specificProduct?.product?.price}</div>{" "}
                <div>{specificProduct?.product?.category}</div>{" "}
                <div>{specificProduct?.product?.stock}</div>
                <div className="flex gap-2">
                  {specificProduct?.product?.images.map((img, ind) => (
                    <div key={ind} className="flex">
                      <Image
                        src={`http://localhost:8000${img?.imageUrl}`}
                        alt="images"
                        height={100}
                        width={100}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <pre>{JSON.stringify(specificProduct, 2, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default memo(ProductDetails);
