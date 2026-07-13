import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export interface Vehicle {
  id: string;
  regNo: string;
  registration_number: string;
  name: string;
  model: string;
  type: string;
  brand?: string;
  capacityKg: number;
  max_load_capacity: number;
  current_odometer: number;
  odometer: number;
  acqCost: number;
  acquisition_cost: number;
  status: 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED' | string;
  region?: string;
  fuel_type?: string;
  notes?: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  isLoading: false,
  error: null,
};

const mapVehicle = (v: any): Vehicle => ({
  id: v.id,
  regNo: v.registration_number || v.regNo || '',
  registration_number: v.registration_number || v.regNo || '',
  name: v.name || v.model || '',
  model: v.model || '',
  type: v.type || 'Truck',
  brand: v.brand || '',
  capacityKg: v.max_load_capacity || v.capacityKg || 0,
  max_load_capacity: v.max_load_capacity || v.capacityKg || 0,
  current_odometer: v.current_odometer || v.odometer || 0,
  odometer: v.current_odometer || v.odometer || 0,
  acqCost: v.acquisition_cost || v.acqCost || 0,
  acquisition_cost: v.acquisition_cost || v.acqCost || 0,
  status: v.status || 'AVAILABLE',
  region: v.region || '',
  fuel_type: v.fuel_type || '',
  notes: v.notes || '',
});

export const fetchVehicles = createAsyncThunk('vehicles/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/vehicles');
    return (response.data.data || []).map(mapVehicle);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch vehicles');
  }
});

export const createVehicle = createAsyncThunk('vehicles/create', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/vehicles', data);
    return mapVehicle(response.data.data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create vehicle');
  }
});

export const updateVehicle = createAsyncThunk('vehicles/update', async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/vehicles/${id}`, data);
    return mapVehicle(response.data.data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update vehicle');
  }
});

export const setVehicleStatusAPI = createAsyncThunk('vehicles/setStatus', async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/vehicles/${id}/status`, { status });
    return { id, status: response.data.data?.status || status };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update status');
  }
});

export const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles.unshift(action.payload);
    },
    deleteVehicle: (state, action: PayloadAction<string>) => {
      state.vehicles = state.vehicles.filter(v => v.id !== action.payload && v.regNo !== action.payload);
    },
    setVehicleStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const vehicle = state.vehicles.find(v => v.id === action.payload.id || v.regNo === action.payload.id);
      if (vehicle) vehicle.status = action.payload.status;
    },
    updateOdometer: (state, action: PayloadAction<{ id: string; distance: number }>) => {
      const vehicle = state.vehicles.find(v => v.id === action.payload.id || v.regNo === action.payload.id);
      if (vehicle) {
        vehicle.odometer += action.payload.distance;
        vehicle.current_odometer += action.payload.distance;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchVehicles.fulfilled, (state, action) => { state.isLoading = false; state.vehicles = action.payload; })
      .addCase(fetchVehicles.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(createVehicle.fulfilled, (state, action) => { state.vehicles.unshift(action.payload); })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex(v => v.id === action.payload.id);
        if (index !== -1) state.vehicles[index] = action.payload;
      })
      .addCase(setVehicleStatusAPI.fulfilled, (state, action) => {
        const vehicle = state.vehicles.find(v => v.id === action.payload.id);
        if (vehicle) vehicle.status = action.payload.status;
      });
  },
});

export const { addVehicle, deleteVehicle, setVehicleStatus, updateOdometer } = vehicleSlice.actions;
export default vehicleSlice.reducer;