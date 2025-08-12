import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthResponse, RegisterInput, UserResponse } from "../types/user";
import { getCurrentUser, register as registerApi } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  token: string | null;
  error: string | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  register: (data: RegisterInput) => Promise<void>;
  clearError: () => void;
  updateUser: (updatedUser: UserResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (data: RegisterInput) => {
    try {
      const res = await registerApi(data);
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      setError(null);
      navigate("/"); 
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to register.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getCurrentUser(token);
          setUser(res.user ?? res); 
        } catch (err: any) {
          setError("Failed to fetch user. Please login again.");
          logout();
        }
      }
    };
    fetchUser();
  }, [token]);

  const login = (data: AuthResponse) => {
    try {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      setError(null);
      navigate("/"); 
    } catch (err: any) {
      setError("Failed to login.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedUser: UserResponse) => {
    setUser(updatedUser);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, error, login, logout, register, clearError, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
