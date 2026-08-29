import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart, CartItem } from "../../types/cart";

interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const loadCartFromStorage = (): Cart => {
  try {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
  }

  return {
    id: "local-cart",
    items: [],
    total: 0,
  };
};

const saveCartToStorage = (cart: Cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce(
    (total, item) => total + Number(item.subtotal),
    0,
  );
};

const initialCart = loadCartFromStorage();

const initialState: CartState = {
  cart: initialCart,
  loading: false,
  error: null,
  successMessage: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    addItemToCart: (
      state,
      action: PayloadAction<{
        productId: string;
        productName: string;
        price: string;
        imageUrl?: string;
        quantity: number;
        stock: number;
      }>,
    ) => {
      const {
        productId,
        productName,
        price,
        imageUrl,
        quantity,
        stock,
      } = action.payload;

      const existingItem = state.cart.items.find(
        (item) => item.product_id === productId,
      );

      if (existingItem) {
        existingItem.quantity += quantity;

        existingItem.subtotal = (
          Number(existingItem.price) * existingItem.quantity
        ).toFixed(2);
      } else {
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          product_id: productId,
          product_name: productName,
          price,
          quantity,
          subtotal: (Number(price) * quantity).toFixed(2),
          image_url: imageUrl,
           stock,
        };

        state.cart.items.push(newItem);
      }

      state.cart.total = calculateCartTotal(state.cart.items);

      saveCartToStorage(state.cart);

      state.successMessage = "Product added to cart";
      state.error = null;
    },

   increaseQuantity: (
  state,
  action: PayloadAction<string>,
) => {
  const item = state.cart.items.find(
    (item) => item.product_id === action.payload,
  );

  if (item) {
    if (item.quantity >= item.stock) {
      return;
    }

    item.quantity += 1;

    item.subtotal = (
      Number(item.price) * item.quantity
    ).toFixed(2);

    state.cart.total = calculateCartTotal(
      state.cart.items,
    );

    saveCartToStorage(state.cart);
  }
},

    decreaseQuantity: (
      state,
      action: PayloadAction<string>,
    ) => {
      const item = state.cart.items.find(
        (item) => item.product_id === action.payload,
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;

          item.subtotal = (
            Number(item.price) * item.quantity
          ).toFixed(2);
        }

        state.cart.total = calculateCartTotal(state.cart.items);

        saveCartToStorage(state.cart);
      }
    },

    removeItemFromCart: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.cart.items = state.cart.items.filter(
        (item) => item.product_id !== action.payload,
      );

      state.cart.total = calculateCartTotal(state.cart.items);

      saveCartToStorage(state.cart);

      state.successMessage = "Product removed from cart";
    },

    clearCart: (state) => {
      state.cart.items = [];
      state.cart.total = 0;

      saveCartToStorage(state.cart);
    },

    clearCartMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  addItemToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItemFromCart,
  clearCart,
  clearCartMessages,
} = cartSlice.actions;

export default cartSlice.reducer;