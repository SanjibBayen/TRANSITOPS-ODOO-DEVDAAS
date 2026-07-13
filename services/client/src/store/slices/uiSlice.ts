import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface SystemAlert {
  id: string;
  type: 'ALERT' | 'INFO' | 'UPDATE';
  message: string;
}

export type ActiveTab = 
  | 'dashboard' | 'fleet' | 'drivers' | 'trips' | 'dispatch'
  | 'maintenance' | 'fuel' | 'expenses' | 'analytics' | 'reports'
  | 'documents' | 'notifications' | 'compliance' | 'license-expiry'
  | 'export' | 'settings' | 'support' | 'profile';

interface UiState {
  activeTab: ActiveTab;
  sidebarCollapsed: boolean;
  searchQuery: string;
  toasts: ToastMessage[];
  alerts: SystemAlert[];
}

const initialState: UiState = {
  activeTab: 'dashboard',
  sidebarCollapsed: false,
  searchQuery: '',
  toasts: [],
  alerts: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<ActiveTab>) => {
      state.activeTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      state.toasts.push({ ...action.payload, id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 6)}` });
      if (state.toasts.length > 5) state.toasts.shift();
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    addAlert: (state, action: PayloadAction<Omit<SystemAlert, 'id'>>) => {
      state.alerts.push({ ...action.payload, id: `alert_${Date.now()}` });
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
    },
  },
});

export const { 
  setActiveTab, toggleSidebar, setSidebarCollapsed, 
  setSearchQuery, addToast, removeToast, addAlert, removeAlert 
} = uiSlice.actions;

export default uiSlice.reducer;