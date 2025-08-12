// src/pages/ProductDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "../types/product";
import { fetchProductById } from "../services/ProductService";
import { createOrder } from "../services/OrderService";
import { useAuth } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:8000";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  
  const handleOrder = async () => {
      try {
          if (!token || !user) {
              alert("Silakan login terlebih dahulu.");
              return;
            }
    if (!product) return; 
            
    const order = await createOrder({
      product_id: product.id,
      quantity: 1, 
    }, token);

    navigate(`/checkout/${order.id}`);
  } catch (error) {
    console.error(error);
    alert("Gagal membuat order.");
  }
};

  useEffect(() => {
    if (id) {
      fetchProductById(Number(id)).then(setProduct);
    }
  }, [id]);

  if (!product) {
    return <div className="text-center py-20 text-gray-600 dark:text-gray-300">Loading product...</div>;
  }

  return (
    <div className="pt-20 min-h-screen px-4 md:px-10 lg:px-20 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-gray-800 p-6 md:p-10 rounded-xl shadow-xl">
        <div className="relative">
          <img
            src={`${BASE_URL}${product.image_url}`}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-xl shadow"
            loading="lazy"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-3 text-purple-700 dark:text-purple-400">
            {product.name}
          </h1>
          <p className="text-2xl text-green-600 font-semibold mb-4">
            Rp. {product.price.toLocaleString("id-ID")}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {product.description || "No description available for this product."}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
           {product.type && product.type.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {product.type.map((t: any, index: number) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    Type: {t.name} - {t.size}
                  </span>
                ))}
              </div>
            )}

            {product.color && (
              <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-medium">
                Color: {product.color}
              </span>
            )}
            {product.age !== undefined && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                Age: {product.age}
              </span>
            )}
          </div>

         <button
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        onClick={handleOrder}
        >
        Order
        </button>
        </div>
      </div>
    </div>
  );
}
