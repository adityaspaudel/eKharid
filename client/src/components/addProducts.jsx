"use client";

import { memo, useCallback, useEffect, useState } from "react";
import axios from "axios";

function AddProducts({ sellerId }) {
  console.log("sellerId", sellerId);

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    sellerName: "",
    sellerEmail: "",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ handleChange — no need for preventDefault in input handlers
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const newImages = [...images, ...files];
    if (newImages.length > 5) {
      alert("You can only upload up to 5 images!");
      return;
    } else if (newImages.length > 0) {
      setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    }
  };

  // ✅ Memoized seller details fetch
  const fetchSellerDetails = useCallback(async () => {
    if (!sellerId) return;
    try {
      const { data } = await axios.get(
        `http://localhost:8000/seller/${sellerId}/getSellerDetails`
      );
      console.log("Seller data:", data);

      setProduct((prev) => ({
        ...prev,
        sellerName: data?.seller.fullName || "",
        sellerEmail: data?.seller.email || "",
      }));
    } catch (error) {
      console.error("Failed to load seller details:", error);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchSellerDetails();
  }, [fetchSellerDetails]);

  // ✅ Stable submit handler
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      try {
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) =>
          formData.append(key, value)
        );
        images.forEach((file) => formData.append("images", file));

        const { data } = await axios.post(
          `http://localhost:8000/seller/${sellerId}/addProducts`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setMessage(data.message);
        setProduct({
          title: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          sellerName: product.sellerName,
          sellerEmail: product.sellerEmail,
        });
        setImages([]);
        setPreviewImages([]);
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || "Upload failed");
      } finally {
        setLoading(false);
      }
    },
    [sellerId, product, images]
  );

  return (
    <main className="p-10 flex flex-col gap-6 max-w-96 mx-auto w-[400px]">
      {/* <h1 className="text-3xl font-bold text-center"></h1> */}

      {message && (
        <div className="bg-green-200 text-green-800 p-2 rounded">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {["title", "description", "price", "category", "stock"].map((field) => (
          <input
            key={field}
            name={field}
            type={field === "price" || field === "stock" ? "number" : "text"}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={product[field]}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        ))}

        <input
          name="sellerName"
          placeholder="Seller Name"
          value={product.sellerName}
          className="border p-2 rounded"
          disabled
        />
        <input
          name="sellerEmail"
          type="email"
          placeholder="Seller Email"
          value={product.sellerEmail}
          className="border p-2 rounded"
          disabled
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded"
          required
        />

        {previewImages.length > 0 && previewImages.length <= 5 ? (
          <div className="flex gap-2 flex-wrap mt-2">
            {previewImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Preview ${i}`}
                className="w-24 h-24 object-cover border rounded"
              />
            ))}
          </div>
        ) : (
          <div></div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white py-2 rounded"
        >
          {loading ? "adding..." : "Add Product"}
        </button>
      </form>
    </main>
  );
}

export default memo(AddProducts);
