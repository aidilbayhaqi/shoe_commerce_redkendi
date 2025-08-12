import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createProduct } from "../services/ProductService";
import { ProductTypeItem } from "../types/product";
import { useNavigate } from "react-router-dom";

export default function ProductCreatePage() {
  const { token } = useAuth();
  const Navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [color, setColor] = useState("");
  const [gender, setGender] = useState("unisex");
  const [age, setAge] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [types, setTypes] = useState<ProductTypeItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddType = () => {
    setTypes([...types, { name: "", size: 0 }]);
  };

  const handleTypeChange = (
    index: number,
    field: keyof ProductTypeItem,
    value: string | number
  ) => {
    const updated = [...types];
    if (field === "size") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }
    setTypes(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("stock", stock.toString());
    formData.append("color", color);
    formData.append("gender", gender);
    formData.append("age", age.toString());
    formData.append("image", image);
    formData.append("type", JSON.stringify(types));

    try {
      await createProduct(formData, token);
      alert("Produk berhasil dibuat!");
      Navigate('/')
    } catch (error) {
      console.error("Gagal membuat produk:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-20 py-10 px-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Tambah Produk</h1>
      <form
        onSubmit={handleSubmit}
        className="dark:bg-gray-800 bg-white dark:text-black p-6 shadow-md rounded-lg space-y-6 border"
      >
        <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-4 label:text-black">
        <Input label="Nama Produk" value={name} onChange={(val) => setName(val as string)}/>
        <Input label="Harga" type="number" value={price} onChange={(val) => setPrice(Number(val))} />
        <Input label="Stok" type="number" value={stock} onChange={(val) => setStock(Number(val))} />
        <Input label="Warna" value={color} onChange={(val) => setColor(val as string)} />
        <Input label="Usia" type="number" value={age} onChange={(val) => setAge(Number(val))} />


          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="unisex">Unisex</option>
              <option value="male">Pria</option>
              <option value="female">Wanita</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              required
              className="w-full"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tipe Produk</h3>
          {types.map((type, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                className="flex-1 border rounded px-3 py-2"
                value={type.name}
                onChange={(e) => handleTypeChange(index, "name", e.target.value)}
                placeholder="Ukuran (S, M, L)"
                required
              />
              <input
                className="w-32 border rounded px-3 py-2"
                type="number"
                value={type.size}
                onChange={(e) => handleTypeChange(index, "size", e.target.value)}
                placeholder="Harga"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddType}
            className="text-sm text-blue-600 hover:underline mt-1"
          >
            + Tambah Tipe
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>
  );
}
