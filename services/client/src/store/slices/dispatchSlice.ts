import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface DispatchState {
  availableVehicles: any[];
  availableDrivers: any[];
  pendingTrips: any[];
  validationResult: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DispatchState = {
  availableVehicles: [],
  availableDrivers: [],
  pendingTrips: [],
  validationResult: null,
  isLoading: false,
  error: null,
};

export const fetchAvailableResources = createAsyncThunk('dispatch/resources', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/dispatch/available-resources');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load resources');
  }
});

export const validateDispatch = createAsyncThunk('dispatch/validate', async (data: { trip_id: string; vehicle_id: string; driver_id: string }, { rejectWithValue }) => {
  try {
    const response = await api.post('/dispatch/validate', data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Validation failed');
  }
});

export const dispatchTrip = createAsyncThunk('dispatch/dispatch', async (tripId: string, { rejectWithValue }) => {
  try {
    const response = await api.post(`/dispatch/dispatch/${tripId}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Dispatch failed');
  }
});

const dispatchSlice = createSlice({
  name: 'dispatch',
  initialState,
  reducers: {
    clearValidation: (state) => { state.validationResult = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableResources.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAvailableResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableVehicles = action.payload.vehicles || [];
        state.availableDrivers = action.payload.drivers || [];
        state.pendingTrips = action.payload.pendingTrips || [];
      })
      .addCase(fetchAvailableResources.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(validateDispatch.fulfilled, (state, action) => { state.validationResult = action.payload; })
      .addCase(dispatchTrip.fulfilled, (state) => { state.validationResult = null; });
  },
});

export const { clearValidation } = dispatchSlice.actions;
export default dispatchSlice.reducer;