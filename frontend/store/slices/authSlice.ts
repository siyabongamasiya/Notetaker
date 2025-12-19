import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

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

/*THUNKS */

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
      const res = await api.post("/auth/register", {
        email,
        username,
        password,
      });
      await AsyncStorage.setItem("token", res.data.token);
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
      const res = await api.post("/auth/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Login failed");
    }
  }
);

// Get Profile
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/profile");
      return res.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to get profile"
      );
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
      const res = await api.put("/auth/profile", { email, username });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Update failed");
    }
  }
);

/*SLICE*/

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      AsyncStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      /* REGISTER*/
      .addCase(registerUser.pending, (s) => {
        s.loading = true;
        s.error = null;
        Toast.show({
          type: "info",
          text1: "Registering user...",
          autoHide: false,
        });
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        Toast.hide();
        Toast.show({ type: "success", text1: "Registration successful" });
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
        Toast.hide();
        Toast.show({ type: "error", text1: s.error });
      })

      /*LOGIN*/
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
        Toast.show({ type: "info", text1: "Logging in...", autoHide: false });
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        Toast.hide();
        Toast.show({ type: "success", text1: "Login successful" });
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
        Toast.hide();
        Toast.show({ type: "error", text1: s.error });
      })

      /*GET PROFILE*/
      .addCase(getProfile.pending, (s) => {
        Toast.show({
          type: "info",
          text1: "Fetching profile...",
          autoHide: false,
        });
      })
      .addCase(getProfile.fulfilled, (s, a) => {
        s.user = a.payload;
        Toast.hide();
      })
      .addCase(getProfile.rejected, (s, a) => {
        s.error = a.payload as string;
        Toast.hide();
        Toast.show({ type: "error", text1: s.error });
      })

      /*UPDATE PROFILE*/
      .addCase(updateProfile.pending, (s) => {
        Toast.show({
          type: "info",
          text1: "Updating profile...",
          autoHide: false,
        });
      })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.user = a.payload;
        Toast.hide();
        Toast.show({ type: "success", text1: "Profile updated" });
      })
      .addCase(updateProfile.rejected, (s, a) => {
        s.error = a.payload as string;
        Toast.hide();
        Toast.show({ type: "error", text1: s.error });
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
