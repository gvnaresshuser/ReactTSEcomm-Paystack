import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { AuthResponse, LoginData, RegisterData, User } from "../../types/auth";

interface AuthState {
    user: User | null;
    loading: boolean;
    isInitialized: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    isInitialized: false,
    error: null,
    successMessage: null
};

export const registerUser = createAsyncThunk<AuthResponse, RegisterData, { rejectValue: string }>(
    "auth/registerUser",
    async (registerData, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>("/api/auth/register", registerData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

/* export const loginUser = createAsyncThunk<AuthResponse, LoginData, { rejectValue: string }>(
    "auth/loginUser",
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>("/api/auth/login", loginData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
); */
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginData,
  { rejectValue: string }
>(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/auth/login",
        loginData,
      );

      // ----------------------------------------
      // STORE JWT TOKEN
      // ----------------------------------------
      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token,
        );
      }

      return response.data;

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed",
      );
    }
  },
);

/* export const logoutUser = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>("/api/auth/logout");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
); */
export const logoutUser = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/auth/logout",
      );

      // ----------------------------------------
      // REMOVE JWT TOKEN
      // ----------------------------------------
      localStorage.removeItem("token");

      return response.data;

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Logout failed",
      );
    }
  },
);

export const getCurrentUser = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
    "auth/getCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<AuthResponse>("/api/auth/me");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Not authenticated");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        logout: (state) => {
            state.user = null;
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || null;
                state.successMessage = action.payload.message;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || null;
                state.successMessage = action.payload.message;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })
           .addCase(getCurrentUser.pending, (state) => {
            state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || null;
                state.isInitialized = true;
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isInitialized = true;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null;
                state.successMessage = action.payload.message;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Logout failed";
            })
    }
});

export const { clearAuthMessages, logout } = authSlice.actions;
export default authSlice.reducer;