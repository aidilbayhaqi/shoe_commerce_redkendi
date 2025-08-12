// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from "./pages/HomePage";
import Navbar from "./components/navbar";
import ProductDetailPage from "./pages/ProductDetail";
import CheckoutPage from "./pages/CheckoutPage";
import OrderListPage from "./pages/OrderListPage";
import CheckoutListPage from "./pages/CheckoutList";
import ProfilePage from "./pages/profilePage";
import ProductCreatePage from "./pages/ProductCreate";

function App() {
  return (
    <Router> {/* ⬅️ Router harus paling luar */}
      <ThemeProvider>
        <AuthProvider>
          <div className="dark:bg-black dark:text-white bg-white text-black min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            {/* Halaman Produk */}
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/admin/create-product" element={<ProductCreatePage />} />
            
            
            {/* Halaman Order */}
            <Route path="/orders" element={<OrderListPage/>}/>
            {/* Halaman Checkout */}
            <Route path="/checkout/:orderId" element={<CheckoutPage/>} />
            <Route path="/checkouts" element={<CheckoutListPage/>}/>
            
            {/* Halaman Login dan Register */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>

          </div>
            {/* Route lainnya */}
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
