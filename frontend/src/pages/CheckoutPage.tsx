import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCheckout } from "../services/CheckoutService";
import { useAuth } from "../context/AuthContext";
import { getOrderById } from "../services/OrderService";
import { Order } from "../types/order";

export default function CheckoutPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { token, user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [no_hp, setNo_hp] = useState("");

  const [errors, setErrors] = useState<{ email?: string; address?: string; no_hp?: string }>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId || !token) return;
        const data = await getOrderById(Number(orderId), token);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  // Set initial form values from user
  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.address) setAddress(user.address);
      if (user.phone) setNo_hp(user.phone);
    }
  }, [user]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email tidak valid";
    if (!address || address.length < 5) newErrors.address = "Alamat harus lebih dari 5 karakter";
    if (!no_hp || no_hp.length < 8) newErrors.no_hp = "No. Telepon tidak valid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (!order || !token) return;
      await createCheckout(
        {
          order_id: order.id,
          payment_method: paymentMethod,
          email,
          address,
          no_hp,
        },
        token
      );
      alert("Checkout berhasil!");
      navigate("/orders");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Gagal checkout");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading checkout data...</div>;
  }

  if (!order) {
    return (
      <div className="text-center mt-10 text-red-600">
        Order tidak ditemukan.
      </div>
    );
  }
  

  return (
    <div className="max-w-xl h-screen mx-auto px-4 py-10 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-md">
        <p>
          <strong>Nama Produk:</strong> {order.product.name}
        </p>
        <p>
          <strong>Total Harga:</strong> RP {order.total_price.toLocaleString("id-ID")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded text-black"
              placeholder="Masukkan email aktif"
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Alamat</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border px-4 py-2 rounded text-black"
              placeholder="Masukkan alamat lengkap"
              required
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">No. Telepon</label>
            <input
              type="tel"
              value={no_hp}
              onChange={(e) => setNo_hp(e.target.value)}
              className="w-full border px-4 py-2 rounded text-black"
              placeholder="08xxxxxxxxxx"
              required
            />
            {errors.no_hp && <p className="text-red-500 text-sm">{errors.no_hp}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Metode Pembayaran</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border px-4 py-2 rounded text-black"
            >
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="COD">Cash on Delivery</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Bayar Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
