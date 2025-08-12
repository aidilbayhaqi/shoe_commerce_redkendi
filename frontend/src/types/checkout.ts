import { Product } from "./product";


export interface CheckoutCreate {
  order_id: number;
  payment_method: string;
  address?: string;
  email?: string;
  no_hp?: string;
}

export interface CheckoutResponse extends CheckoutCreate {
 id: number;
  order_id: number;
  user_id: number;
  product_id: number;
  total_price: number;
  payment_method: string;
  status: string;
  created_at: string;
  address: string;
  email: string;
  no_hp: string;
  product: Product; 
}
