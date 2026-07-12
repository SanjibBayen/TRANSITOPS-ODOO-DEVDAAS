import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Dispatcher' | 'Manager' | 'Driver' | 'Safety Officer' | 'Financial Analyst';
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeScope: 'fleet-manager' | 'dispatcher';
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: {
    id: 'usr_001',
    name: 'Raven K.',
    email: 'Raven.k@transitops.in',
    role: 'Manager',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYBkw3LHcTwmizgJ3i8YKR18fYqElE3Mg9j2KIiAk20JcN3_h5fi77C0J2BvviOW_QR2oyHcQ1XeYxnzmkweobMewYAuRyAzEJWCwz1f8yi2isPQCNymxtX7N0ODA2q72p8krMwTYMqNCrLU0kY2W6SZhU8o4L_fBJxZlYDMT_ZRzWlderTFed7dQY7vdEiknxiWpdbu7Khs7Et6zBYfdMI_lfWSWZaqHVYJvvx84zfuptWyJN5g9-',
  },
  isAuthenticated: true, // Default authenticated for a seamless dashboard landing
  activeScope: 'fleet-manager',
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; scope: 'fleet-manager' | 'dispatcher' }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.activeScope = action.payload.scope;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.activeScope = 'fleet-manager';
    },
    setActiveScope: (state, action: PayloadAction<'fleet-manager' | 'dispatcher'>) => {
      state.activeScope = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setActiveScope, updateProfile, clearError } = authSlice.actions;
export default authSlice.reducer;
