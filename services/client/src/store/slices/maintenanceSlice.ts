import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface Maintenance {
  id: string;
  vehicle_id: string;
  type: string;
  description?: string;
  service_center?: string;
  cost: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  vehicle?: { registration_number: string };
  started_at: string;
  completed_at?: string;
}

interface MaintenanceState {
  maintenances: Maintenance[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MaintenanceState = {
  maintenances: [],
  isLoading: false,
  error: null,
};

export const fetchMaintenance = createAsyncThunk('maintenance/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/maintenance');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch maintenance');
  }
});

export const createMaintenance = createAsyncThunk('maintenance/create', async (data: Partial<Maintenance>, { rejectWithValue }) => {
  try {
    const response = await api.post('/maintenance', data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create maintenance');
  }
});

export const completeMaintenance = createAsyncThunk('maintenance/complete', async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/maintenance/${id}/complete`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to complete maintenance');
  }
});

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenance.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMaintenance.fulfilled, (state, action) => { state.isLoading = false; state.maintenances = action.payload; })
      .addCase(fetchMaintenance.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(createMaintenance.fulfilled, (state, action) => { state.maintenances.push(action.payload); })
      .addCase(completeMaintenance.fulfilled, (state, action) => {
        const index = state.maintenances.findIndex(m => m.id === action.payload.id);
        if (index !== -1) state.maintenances[index] = action.payload;
      });
  },
});

export default maintenanceSlice.reducer;