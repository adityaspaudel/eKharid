'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AddProducts({ sellerId }) {
  console.log('sellerId', sellerId);
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sellerName: '',
    sellerEmail: '',
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Show image preview
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewUrls);
  };

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/seller/${sellerId}/getSellerDetails`
        );

        console.log('Seller data', data);

        setProduct((prev) => ({
          ...prev,
          sellerName: data.fullName,
          sellerEmail: data.email,
        }));
      } catch (error) {
        console.error('Failed to load seller details:', error);
      }
    };

    if (sellerId) fetchSellerDetails();
  }, [sellerId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      for (const key in product) {
        formData.append(key, product[key]);
      }
      images.forEach((file) => {
        formData.append('images', file);
      });

      const res = await axios.post(
        `http://localhost:8000/seller/${sellerId}/addProducts`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setMessage(res.data.message);
      setProduct({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
      });
      setImages([]);
      setPreviewImages([]);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 flex flex-col gap-6 max-w-96 mx-auto ">
      <h1 className="text-3xl font-bold text-center">🛍️ Add Product</h1>

      {message && (
        <div className="bg-green-200 text-green-800 p-2 rounded">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Product Title"
          value={product.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock Quantity"
          value={product.stock}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="sellerName"
          placeholder="Seller Name"
          value={product.sellerName}
          onChange={handleChange}
          className="border p-2 rounded"
          disabled
        />
        <input
          name="sellerEmail"
          type="email"
          placeholder="Seller Email"
          value={product.sellerEmail}
          onChange={handleChange}
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

        {previewImages.length > 0 && (
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
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 rounded"
        >
          {loading ? 'adding...' : 'Add Product'}
        </button>
      </form>
    </main>
  );
}
