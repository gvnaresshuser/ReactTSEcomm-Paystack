import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import productPaginationReducer from "./slices/productPaginationSlice";
import productCategoriesReducer from "./slices/productCategoriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    productPagination: productPaginationReducer,
    productCategories: productCategoriesReducer,
    cart: cartReducer,    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;