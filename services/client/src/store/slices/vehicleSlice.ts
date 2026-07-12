import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios.ts';

export interface Vehicle {
  id?: string;
  regNo: string;
  registration_number?: string;
  name?: string;
  model: string;
  type: 'Van' | 'Truck (Heavy)' | 'Refrigerated' | 'Flatbed' | 'MUV' | string;
  capacityKg: number;
  max_load_capacity?: number;
  odometer: number;
  acqCost: number;
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired' | string;
  lastServiceDate?: string;
  insuranceExpiry?: string;
  fitnessCertificateExpiry?: string;
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

export const fetchVehicles = createAsyncThunk('vehicles/fetchAll', async () => {
  const response = await api.get('/vehicles');
  return response.data.data.map((v: any) => ({
    id: v.id,
    regNo: v.registration_number || v.regNo,
    name: v.name || v.registration_number,
    model: v.model,
    type: v.type,
    capacityKg: v.max_load_capacity || v.capacityKg || 0,
    odometer: v.odometer || 0,
    acqCost: v.acquisition_cost || v.acqCost || 0,
    status: v.status,
    notes: v.notes,
  }));
});

export const createVehicle = createAsyncThunk('vehicles/create', async (data: any) => {
  const response = await api.post('/vehicles', data);
  const v = response.data.data;
  return {
    id: v.id,
    regNo: v.registration_number || v.regNo,
    name: v.name || v.registration_number,
    model: v.model,
    type: v.type,
    capacityKg: v.max_load_capacity || v.capacityKg || 0,
    odometer: v.odometer || 0,
    acqCost: v.acquisition_cost || v.acqCost || 0,
    status: v.status,
    notes: v.notes,
  };
});

export const updateVehicle = createAsyncThunk('vehicles/update', async ({ id, data }: any) => {
  const response = await api.put(`/vehicles/${id}`, data);
  const v = response.data.data;
  return {
    id: v.id,
    regNo: v.registration_number || v.regNo,
    name: v.name || v.registration_number,
    model: v.model,
    type: v.type,
    capacityKg: v.max_load_capacity || v.capacityKg || 0,
    odometer: v.odometer || 0,
    acqCost: v.acquisition_cost || v.acqCost || 0,
    status: v.status,
    notes: v.notes,
  };
});

export const setVehicleStatusAPI = createAsyncThunk('vehicles/setStatus', async ({ id, status }: any) => {
  const response = await api.patch(`/vehicles/${id}/status`, { status });
  const v = response.data.data;
  return {
    id: v.id,
    status: v.status,
  };
});

export const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles.unshift(action.payload);
    },
    deleteVehicle: (state, action: PayloadAction<string>) => {
      state.vehicles = state.vehicles.filter(v => v.regNo !== action.payload && v.id !== action.payload);
    },
    setVehicleStatus: (state, action: PayloadAction<{ regNo: string; status: Vehicle['status'] }>) => {
      const vehicle = state.vehicles.find(v => v.regNo === action.payload.regNo || v.id === action.payload.regNo);
      if (vehicle) {
        vehicle.status = action.payload.status;
      }
    },
    updateOdometer: (state, action: PayloadAction<{ regNo: string; distance: number }>) => {
      const vehicle = state.vehicles.find(v => v.regNo === action.payload.regNo || v.id === action.payload.regNo);
      if (vehicle) {
        vehicle.odometer += action.payload.distance;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch vehicles';
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.vehicles.unshift(action.payload);
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex((v: any) => v.id === action.payload.id || v.regNo === action.payload.regNo);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
      })
      .addCase(setVehicleStatusAPI.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex((v: any) => v.id === action.payload.id);
        if (index !== -1) {
          state.vehicles[index].status = action.payload.status;
        }
      });
  },
});

export const { addVehicle, deleteVehicle, setVehicleStatus, updateOdometer } = vehicleSlice.actions;
export default vehicleSlice.reducer;
