import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

interface ProductCategoriesState {
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductCategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchProductCategories =
  createAsyncThunk(
    "productCategories/fetchCategories",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products-pagination/categories`,
        );

        return response.data.categories;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(
            error.response?.data?.message ||
              "Failed to fetch categories",
          );
        }

        return rejectWithValue(
          "Failed to fetch categories",
        );
      }
    },
  );

const productCategoriesSlice =
  createSlice({
    name: "productCategories",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
      builder

        .addCase(
          fetchProductCategories.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          },
        )

        .addCase(
          fetchProductCategories.fulfilled,
          (state, action) => {
            state.loading = false;
            state.categories =
              action.payload;
          },
        )

        .addCase(
          fetchProductCategories.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              (action.payload as string) ||
              "Failed to fetch categories";
          },
        );
    },
  });

export default productCategoriesSlice.reducer;