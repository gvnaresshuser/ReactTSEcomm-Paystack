export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  price: string;
  quantity: number;
  subtotal: string;
  image_url?: string;
  stock: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
  message?: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartData {
  cartItemId: string;
  quantity: number;
}