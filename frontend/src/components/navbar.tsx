// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const { user, logout } = useAuth();

  console.log("Current user: ", user);

  
  const handleLogout = () => {
    logout();
    setOpenDropdown(false);
  };

  return (
    <nav className="fixed w-full z-50 justify-between backdrop-blur-md bg-white/30 dark:bg-black/30 border-b border-white/20 dark:border-white/10 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link to="/">MyShop</Link>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex gap-6 text-sm items-center justify-center ml-5 font-medium text-gray-800 dark:text-white">
          <Link to="/" className="hover:text-blue-500 transition">
            Home
          </Link>
          <Link to="/orders" className="hover:text-blue-500 transition">
            Order
          </Link>
          <Link to="/checkouts" className="hover:text-blue-500 transition">
            Checkout
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4 relative">
          {/* User Dropdown */}
          <div className="relative">
            <button onClick={() => setOpenDropdown(!openDropdown)}>
              <User className="w-5 h-5 text-gray-700 dark:text-white" />
            </button>
            {openDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded shadow-md py-2 z-50">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setOpenDropdown(false)}
                    >
                        
                      Login
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setOpenDropdown(false)}
                    >
                      {user.username || "Profile"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button onClick={toggleTheme}>
            {theme === "light" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-800 dark:text-white" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
