export interface ProductTypeItem {
  name: string;
  size: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  created_at: string; 
  stock: number;
  type?: ProductTypeItem[];
  color?: string;
  gender?: string;
  age?: number;
}