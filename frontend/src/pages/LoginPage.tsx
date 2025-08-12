// src/pages/LoginPage.tsx
import { useState } from "react";
import { login as loginApi } from "../services/AuthService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      const res = await loginApi({ email, password }); 
      login(res); 
      console.log("Current user: ", res.user); 
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Login gagal");
    } 
  };

 return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700 dark:text-white">
          Login to Your Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
            <button onClick={clearError} className="ml-2 text-sm underline">
              Clear
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
