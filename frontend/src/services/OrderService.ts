import AxiosInstance from "../api";
import { Order, OrderCreate } from "../types/order";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export const createOrder = async (
    payload: OrderCreate,
    token: string
): Promise<Order> => {
    try {
        const response = await AxiosInstance.post<Order>(`${BASE_URL}/api/orders`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

export const getOrders = async (token: string): Promise<Order[]> => {
  try {
      const response = await AxiosInstance.get(`${BASE_URL}/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; 
  }

};

export const getOrderById = async (id: number, token: string): Promise<Order> => {
  try {
    const res = await AxiosInstance.get(`${BASE_URL}/api/orders/${id}`, {
    headers: {
    Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }

};
