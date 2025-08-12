import AxiosInstance from "../api";
import { Product } from "../types/product";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const fetchProducts = async(): Promise<Product[]> => {
    try {
        const response = await AxiosInstance.get<Product[]>(`${API_BASE_URL}/api/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export async function fetchProductById(id: number): Promise<Product> {
  try {
     const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
     return res.json();
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  } 
}

export const createProduct = async (formData: FormData, token: string) => {
  const response = await AxiosInstance.post(`${API_BASE_URL}/api/products`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};