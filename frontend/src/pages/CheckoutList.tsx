import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCheckouts } from "../services/CheckoutService";
import { CheckoutResponse } from "../types/checkout";

export default function CheckoutListPage() {
  const { token } = useAuth();
  const [checkouts, setCheckouts] = useState<CheckoutResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        if (!token) return;
        const data = await getCheckouts(token);
        setCheckouts(data);
      } catch (err) {
        console.error("Gagal mengambil data checkout:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Memuat data checkout...</div>;
  }

  if (checkouts.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Belum ada data checkout.
      </div>
    );
  }

  const BASE_URL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:8000";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen pt-20">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout Saya</h1>
      <div className="grid gap-6">
        {checkouts.map((checkout) => (
          <div
            key={checkout.id}
            className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden"
          >
            {/* Gambar Produk */}
            {checkout.product && checkout.product.image_url ? (
              <img
                src={`${BASE_URL}${checkout.product.image_url.replace(/\\/g, "/")}`}
                alt={checkout.product.name}
                loading="lazy"
                className="w-full md:w-40 h-40 object-cover"
              />
            ) : (
              <div className="w-full md:w-40 h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                Gambar tidak tersedia
              </div>
            )}

            {/* Info */}
            <div className="flex-1 p-4">
              <h2 className="text-xl font-semibold">
                {checkout.product ? checkout.product.name : "Produk tidak tersedia"}
              </h2>

              <p className="text-gray-600 dark:text-gray-300">
                Total Harga:{" "}
                <span className="font-bold">
                  Rp {checkout.total_price.toLocaleString()}
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Metode Pembayaran: <strong>{checkout.payment_method}</strong>
              </p>

              <p className="text-sm text-gray-500">Email: {checkout.email || "Tidak tersedia"}</p>
              <p className="text-sm text-gray-500">Alamat: {checkout.address || "Tidak tersedia"}</p>
              <p className="text-sm text-gray-500">No HP: {checkout.no_hp || "Tidak tersedia"}</p>

              <p className="text-sm text-gray-500 mt-1">
                Tanggal Checkout: {new Date(checkout.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
