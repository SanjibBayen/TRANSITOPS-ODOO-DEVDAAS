import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface FuelLog {
  id: string;
  vehicle_id: string;
  trip_id?: string;
  liters: number;
  cost: number;
  price_per_liter?: number;
  odometer?: number;
  station?: string;
  date: string;
  vehicle?: { registration_number: string };
}

interface FuelState {
  fuelLogs: FuelLog[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FuelState = {
  fuelLogs: [],
  isLoading: false,
  error: null,
};

export const fetchFuelLogs = createAsyncThunk('fuel/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/fuel');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch fuel logs');
  }
});

export const createFuelLog = createAsyncThunk('fuel/create', async (data: Partial<FuelLog>, { rejectWithValue }) => {
  try {
    const response = await api.post('/fuel', data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create fuel log');
  }
});

const fuelSlice = createSlice({
  name: 'fuel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFuelLogs.pending, (state) => { state.isLoading = true; })
      .addCase(fetchFuelLogs.fulfilled, (state, action) => { state.isLoading = false; state.fuelLogs = action.payload; })
      .addCase(fetchFuelLogs.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(createFuelLog.fulfilled, (state, action) => { state.fuelLogs.push(action.payload); });
  },
});

export default fuelSlice.reducer;