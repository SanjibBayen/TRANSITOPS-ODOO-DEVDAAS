import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface AnalyticsState {
  dashboard: any | null;
  fleetUtilization: any | null;
  vehicleCosts: any[];
  vehicleROI: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  dashboard: null,
  fleetUtilization: null,
  vehicleCosts: [],
  vehicleROI: [],
  isLoading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk('analytics/dashboard', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/analytics/dashboard');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load dashboard');
  }
});

export const fetchFleetUtilization = createAsyncThunk('analytics/utilization', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/analytics/fleet-utilization');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load utilization');
  }
});

export const fetchVehicleROI = createAsyncThunk('analytics/roi', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/analytics/vehicle-roi');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load ROI');
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDashboard.fulfilled, (state, action) => { state.isLoading = false; state.dashboard = action.payload; })
      .addCase(fetchDashboard.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(fetchFleetUtilization.fulfilled, (state, action) => { state.fleetUtilization = action.payload; })
      .addCase(fetchVehicleROI.fulfilled, (state, action) => { state.vehicleROI = action.payload; });
  },
});

export default analyticsSlice.reducer;