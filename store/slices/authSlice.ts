import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  email: string;
  username: string;
};

type AuthState = {
  user: User | null;
  token?: string | null; // dummy token
};

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (state, action: PayloadAction<{ email: string; password: string; username: string }>) => {
      // dummy registration: store user locally
      const id = String(Date.now());
      state.user = { id, email: action.payload.email, username: action.payload.username };
      state.token = `token-${id}`;
    },
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      // dummy login: accept any credentials
      const id = String(Date.now());
      state.user = { id, email: action.payload.email, username: action.payload.email.split('@')[0] };
      state.token = `token-${id}`;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    updateProfile: (state, action: PayloadAction<{ email?: string; username?: string; password?: string }>) => {
      if (!state.user) return;
      state.user = { ...state.user, ...(action.payload.email ? { email: action.payload.email } : {}), ...(action.payload.username ? { username: action.payload.username } : {}) };
    },
  },
});

export const { register, login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
