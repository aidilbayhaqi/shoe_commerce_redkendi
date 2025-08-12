import { useEffect, useState } from "react";
import { getOrders } from "../services/OrderService";
import { useAuth } from "../context/AuthContext";
import { Order } from "../types/order";
import { Link } from "react-router-dom";

export default function OrderListPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) return;
        const data = await getOrders(token);
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Memuat daftar pesanan...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Belum ada pesanan yang dibuat.
      </div>
    );
  }

  const BASE_URL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:8000";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pt-20">
      <h1 className="text-3xl font-bold text-center mb-8">Daftar Pesanan</h1>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden"
          >
            {/* Gambar produk */}
            <img
              src={`${BASE_URL}${order.product.image_url}`}
              alt={order.product.name}
              className="w-full md:w-40 h-40 object-cover"
              loading="lazy"
            />

            {/* Info Produk */}
            <div className="flex-1 p-4">
              <h2 className="text-xl font-semibold mb-2">
                {order.product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Total Harga: <span className="font-bold">Rp {order.total_price.toLocaleString()}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">Status: <span className={`font-medium ${order.status === "complete" ? "text-green-600" : "text-yellow-600"}`}>{order.status}</span></p>

              {/* Aksi */}
              <div className="mt-4 flex gap-3">
                <Link
                  to={`/products/${order.product_id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Lihat Detail Produk
                </Link>

                {order.status === "pending" && (
                  <Link
                    to={`/checkout/${order.id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                  >
                    Checkout
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
