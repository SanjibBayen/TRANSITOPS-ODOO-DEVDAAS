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

interface UiState {
  activeTab: 'dashboard' | 'fleet' | 'drivers' | 'trips' | 'maintenance' | 'fuel' | 'analytics' | 'settings' | 'support' | 'profile' | 'compliance' | 'license-expiry' | 'export';
  sidebarCollapsed: boolean;
  searchQuery: string;
  toasts: ToastMessage[];
  alerts: SystemAlert[];
}

const initialAlerts: SystemAlert[] = [
  { id: '1', type: 'ALERT', message: 'Vehicle V-005 scheduled for maintenance in 2 hours.' },
  { id: '2', type: 'INFO', message: 'Driver J. Smith completed trip TR099 ahead of schedule.' },
  { id: '3', type: 'UPDATE', message: 'Weather warning: Heavy rain expected on Route 4.' }
];

const initialState: UiState = {
  activeTab: 'dashboard',
  sidebarCollapsed: false,
  searchQuery: '',
  toasts: [],
  alerts: initialAlerts,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<UiState['activeTab']>) => {
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
      const id = 'toast_' + Math.random().toString(36).substr(2, 9);
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    addSystemAlert: (state, action: PayloadAction<Omit<SystemAlert, 'id'>>) => {
      const id = 'alert_' + Math.random().toString(36).substr(2, 9);
      state.alerts.push({ ...action.payload, id });
    },
    removeSystemAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(a => t => a.id !== action.payload);
    }
  },
});

export const { setActiveTab, toggleSidebar, setSidebarCollapsed, setSearchQuery, addToast, removeToast, addSystemAlert, removeSystemAlert } = uiSlice.actions;
export default uiSlice.reducer;
