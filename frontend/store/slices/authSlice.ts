import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export type User = {
  id: string;
  email: string;
  username: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

/* ================== THUNKS ================== */

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    {
      email,
      username,
      password,
    }: { email: string; username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(" http://localhost:4000/api/auth/register", {
        email,
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(" http://localhost:4000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Login failed");
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    { email, username }: { email?: string; username?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(" http://localhost:4000/api/auth/profile", {
        email,
        username,
      });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Update failed");
    }
  }
);

/* ================== SLICE ================== */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      // Update Profile
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.user = a.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
