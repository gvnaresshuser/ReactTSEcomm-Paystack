export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  stock: number;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  message?: string;
}