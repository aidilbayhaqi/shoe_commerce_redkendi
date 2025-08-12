import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const updated = await updateProfile(formData, token);
      updateUser(updated); 
      setMessage("Profil berhasil diperbarui.");
    } catch (err) {
      setMessage("Gagal memperbarui profil.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Memuat data pengguna...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Profil Saya</h1>

      {message && (
        <div className="mb-4 text-center text-sm text-green-600 dark:text-green-400">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded shadow">
        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Alamat</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-medium">No HP</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>

      {/* Only show for admin */}
      {user.is_admin && (
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/admin/create-product")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            + Buat Produk Baru
          </button>
        </div>
      )}
    </div>
  );
}
