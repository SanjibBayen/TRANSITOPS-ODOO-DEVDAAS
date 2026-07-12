import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios.ts';

export interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  license_number?: string;
  licenseType: string;
  license_category?: string;
  licenseExpiry: string;
  license_expiry?: string;
  medicalStatus: 'Passed' | 'Pending Review' | 'Required Soon' | string;
  medicalExpiry: string;
  status: 'Available' | 'On Trip' | 'On Leave' | 'Suspended' | string;
  rating: number; // e.g. 4.8
  tripsCompleted: number;
  phone: string;
  email: string;
  avatar?: string;
  attendanceStatus: 'Present' | 'Absent' | 'Off-duty' | string;
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

export const fetchDrivers = createAsyncThunk('drivers/fetchAll', async () => {
  const response = await api.get('/drivers');
  return response.data.data.map((d: any) => ({
    id: d.id,
    name: d.name,
    licenseNo: d.license_number || d.licenseNo,
    licenseType: d.license_category || d.licenseType || 'Commercial',
    licenseExpiry: d.license_expiry || d.licenseExpiry,
    medicalStatus: d.medicalStatus || 'Passed',
    medicalExpiry: d.medicalExpiry || '2030-01-01',
    status: d.status || 'Available',
    rating: d.rating || 5.0,
    tripsCompleted: d.tripsCompleted || 0,
    phone: d.phone,
    email: d.email || '',
    avatar: d.avatar,
    attendanceStatus: d.attendanceStatus || 'Present',
  }));
});

export const createDriver = createAsyncThunk('drivers/create', async (data: any) => {
  const response = await api.post('/drivers', data);
  const d = response.data.data;
  return {
    id: d.id,
    name: d.name,
    licenseNo: d.license_number || d.licenseNo,
    licenseType: d.license_category || d.licenseType || 'Commercial',
    licenseExpiry: d.license_expiry || d.licenseExpiry,
    medicalStatus: d.medicalStatus || 'Passed',
    medicalExpiry: d.medicalExpiry || '2030-01-01',
    status: d.status || 'Available',
    rating: d.rating || 5.0,
    tripsCompleted: d.tripsCompleted || 0,
    phone: d.phone,
    email: d.email || '',
    avatar: d.avatar,
    attendanceStatus: d.attendanceStatus || 'Present',
  };
});

export const updateDriver = createAsyncThunk('drivers/update', async ({ id, data }: any) => {
  const response = await api.put(`/drivers/${id}`, data);
  const d = response.data.data;
  return {
    id: d.id,
    name: d.name,
    licenseNo: d.license_number || d.licenseNo,
    licenseType: d.license_category || d.licenseType || 'Commercial',
    licenseExpiry: d.license_expiry || d.licenseExpiry,
    medicalStatus: d.medicalStatus || 'Passed',
    medicalExpiry: d.medicalExpiry || '2030-01-01',
    status: d.status || 'Available',
    rating: d.rating || 5.0,
    tripsCompleted: d.tripsCompleted || 0,
    phone: d.phone,
    email: d.email || '',
    avatar: d.avatar,
    attendanceStatus: d.attendanceStatus || 'Present',
  };
});

export const setDriverStatusAPI = createAsyncThunk('drivers/setStatus', async ({ id, status }: any) => {
  const response = await api.patch(`/drivers/${id}/status`, { status });
  return { id, status: response.data.data.status || status };
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
      if (driver) {
        driver.status = action.payload.status;
      }
    },
    setDriverAttendance: (state, action: PayloadAction<{ id: string; status: Driver['attendanceStatus'] }>) => {
      const driver = state.drivers.find(d => d.id === action.payload.id);
      if (driver) {
        driver.attendanceStatus = action.payload.status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.drivers = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch drivers';
      })
      .addCase(createDriver.fulfilled, (state, action) => {
        state.drivers.unshift(action.payload);
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        const index = state.drivers.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.drivers[index] = action.payload;
        }
      })
      .addCase(setDriverStatusAPI.fulfilled, (state, action) => {
        const index = state.drivers.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.drivers[index].status = action.payload.status;
        }
      });
  },
});

export const { addDriver, deleteDriver, setDriverStatus, setDriverAttendance } = driverSlice.actions;
export default driverSlice.reducer;
