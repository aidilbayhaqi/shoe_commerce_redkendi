// src/types/auth.ts
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}


export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  is_admin: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserResponse
}

export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
}
