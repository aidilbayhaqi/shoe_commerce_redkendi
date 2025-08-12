import AxiosInstance from "../api";
import { LoginInput, RegisterInput, AuthResponse, UserUpdate, UserResponse } from "../types/user";



export const login = async (data: LoginInput): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.post<AuthResponse>("/api/users/login", data);
    return response.data;
  } catch (error) {
    console.error("Error in login:", error);
    throw error; 
  }

};

export const register = async (
  data: RegisterInput
): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.post<AuthResponse>("/api/users/register", data);
    return response.data;
  } catch (error) {
    console.error("Error in register:", error);
    throw error; 
  }
};

export const getCurrentUser = async (token: string): Promise<any | null> => {
  try {
    const res = await AxiosInstance.get("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
};

export const updateProfile = async (
  data: UserUpdate,
  token: string
): Promise<UserResponse> => {
  try {
      const res = await AxiosInstance.put("/api/users/me", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
  } catch (error) {
    console.error("Error in updateProfile:", error);
    throw error;
  }
};
