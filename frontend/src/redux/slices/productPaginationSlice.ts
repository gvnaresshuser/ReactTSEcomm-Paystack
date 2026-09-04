import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

/* interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  category?: string;
  stock: number;
} */
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  category?: string;
  stock: number;
  is_active: boolean;
}

interface FetchProductsParams {
  page: number;
  limit: number;
  search: string;
  category: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

interface ProductPaginationState {
  products: Product[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

const initialState: ProductPaginationState = {
  products: [],

  pagination: {
    page: 1,
    limit: 8,
    totalProducts: 0,
    totalPages: 0,
  },

  loading: false,
  error: null,
};

export const fetchProductsPaginated =
  createAsyncThunk(
    "productPagination/fetchProducts",
    async (
      {
        page,
        limit,
        search,
        category,
      }: FetchProductsParams,
      { rejectWithValue },
    ) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products-pagination`,
          {
            params: {
              page,
              limit,
              search,
              category,
            },
          },
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(
            error.response?.data?.message ||
              "Failed to fetch products",
          );
        }

        return rejectWithValue(
          "Failed to fetch products",
        );
      }
    },
  );

const productPaginationSlice =
  createSlice({
    name: "productPagination",

    initialState,

    reducers: {
      clearPaginationProducts: (state) => {
        state.products = [];

        state.pagination = {
          page: 1,
          limit: 8,
          totalProducts: 0,
          totalPages: 0,
        };
      },
    },

    extraReducers: (builder) => {
      builder

        .addCase(
          fetchProductsPaginated.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          },
        )

        .addCase(
          fetchProductsPaginated.fulfilled,
          (state, action) => {
            state.loading = false;

            state.products =
              action.payload.products;

            state.pagination =
              action.payload.pagination;
          },
        )

        .addCase(
          fetchProductsPaginated.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              (action.payload as string) ||
              "Failed to fetch products";
          },
        );
    },
  });

export const {
  clearPaginationProducts,
} = productPaginationSlice.actions;

export default productPaginationSlice.reducer;