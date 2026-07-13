import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  licenseType: string;
  licenseExpiry: string;
  medicalStatus: string;
  medicalExpiry: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED' | string;
  safety_score: number;
  total_trips: number;
  rating: number;
  tripsCompleted: number;
  phone: string;
  email: string;
  avatar?: string;
  attendanceStatus: string;
}

interface DriverState {
  drivers: Driver[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DriverState = {
  drivers: [],
  isLoading: false,
  error: null,
};

const mapDriver = (d: any): Driver => ({
  id: d.id,
  name: d.name,
  licenseNo: d.license_number || d.licenseNo || '',
  licenseType: d.license_category || d.licenseType || 'HMV',
  licenseExpiry: d.license_expiry || d.licenseExpiry || '',
  medicalStatus: d.medicalStatus || 'Passed',
  medicalExpiry: d.medicalExpiry || '',
  status: d.status || 'AVAILABLE',
  safety_score: d.safety_score || 100,
  total_trips: d.total_trips || 0,
  rating: d.safety_score ? Math.round(d.safety_score / 20 * 10) / 10 : 5.0,
  tripsCompleted: d.total_trips || d.tripsCompleted || 0,
  phone: d.phone || '',
  email: d.email || '',
  avatar: d.avatar || '',
  attendanceStatus: d.attendanceStatus || 'Present',
});

export const fetchDrivers = createAsyncThunk('drivers/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/drivers');
    return (response.data.data || []).map(mapDriver);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch drivers');
  }
});

export const createDriver = createAsyncThunk('drivers/create', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/drivers', data);
    return mapDriver(response.data.data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create driver');
  }
});

export const updateDriver = createAsyncThunk('drivers/update', async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/drivers/${id}`, data);
    return mapDriver(response.data.data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update driver');
  }
});

export const setDriverStatusAPI = createAsyncThunk('drivers/setStatus', async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/drivers/${id}/status`, { status });
    return { id, status: response.data.data?.status || status };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update status');
  }
});

export const driverSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    addDriver: (state, action: PayloadAction<Driver>) => {
      state.drivers.unshift(action.payload);
    },
    deleteDriver: (state, action: PayloadAction<string>) => {
      state.drivers = state.drivers.filter(d => d.id !== action.payload);
    },
    setDriverStatus: (state, action: PayloadAction<{ id: string; status: Driver['status'] }>) => {
      const driver = state.drivers.find(d => d.id === action.payload.id);
      if (driver) driver.status = action.payload.status;
    },
    setDriverAttendance: (state, action: PayloadAction<{ id: string; status: Driver['attendanceStatus'] }>) => {
      const driver = state.drivers.find(d => d.id === action.payload.id);
      if (driver) driver.attendanceStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDrivers.fulfilled, (state, action) => { state.isLoading = false; state.drivers = action.payload; })
      .addCase(fetchDrivers.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(createDriver.fulfilled, (state, action) => { state.drivers.unshift(action.payload); })
      .addCase(updateDriver.fulfilled, (state, action) => {
        const index = state.drivers.findIndex(d => d.id === action.payload.id);
        if (index !== -1) state.drivers[index] = action.payload;
      })
      .addCase(setDriverStatusAPI.fulfilled, (state, action) => {
        const driver = state.drivers.find(d => d.id === action.payload.id);
        if (driver) driver.status = action.payload.status;
      });
  },
});

export const { addDriver, deleteDriver, setDriverStatus, setDriverAttendance } = driverSlice.actions;
export default driverSlice.reducer;