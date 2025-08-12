import axiosInstance from "../api";
import { CheckoutCreate, CheckoutResponse } from "../types/checkout";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const createCheckout = async (
  data: CheckoutCreate,
  token: string
): Promise<CheckoutResponse> => {
  try {
      const res = await axiosInstance.post(`${BASE_URL}/api/checkouts`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  console.log("BASE_URL:", BASE_URL);
  console.log("Fetching from:", `${BASE_URL}/api/checkouts/`);;
  return res.data;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error; 
  }
};

export const getCheckouts = async (token: string): Promise<CheckoutResponse[]> => {
  try {
      const response = await axiosInstance.get(`${BASE_URL}/api/checkouts/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
  } catch (error) {
    console.error("Error fetching checkouts:", error);
    throw error; 
  }

};

