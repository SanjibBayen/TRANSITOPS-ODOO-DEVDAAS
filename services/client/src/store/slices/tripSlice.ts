import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios.ts';

export interface Trip {
  id: string;
  vehicleName: string;
  vehicleRegNo: string;
  driverName: string;
  driverId: string;
  status: 'Draft' | 'On Trip' | 'Completed' | 'Delayed' | 'Aborted' | string;
  eta: string;
  etaMinutes: number; // minutes remaining (e.g. 22)
  source: string;
  destination: string;
  currentLocation: string;
  cargoWeightKg: number;
  distanceKm: number;
  fuelUsedLiters: number;
  expenseCost: number;
  startTime: string;
  progressPercent: number; // e.g. 50%
}

interface TripState {
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TripState = {
  trips: [],
  isLoading: false,
  error: null,
};

export const fetchTrips = createAsyncThunk('trips/fetchAll', async () => {
  const response = await api.get('/trips');
  return response.data.data.map((t: any) => ({
    id: t.id,
    vehicleName: t.vehicle?.name || t.vehicle?.model || 'Unknown Vehicle',
    vehicleRegNo: t.vehicle?.registration_number || t.vehicle_id,
    driverName: t.driver?.name || 'Unknown Driver',
    driverId: t.driver_id,
    status: t.status,
    eta: t.eta || 'Unknown',
    etaMinutes: t.etaMinutes || 0,
    source: t.source,
    destination: t.destination,
    currentLocation: t.currentLocation || t.source,
    cargoWeightKg: t.cargo_weight || t.cargoWeightKg || 0,
    distanceKm: t.planned_distance || t.distanceKm || 0,
    fuelUsedLiters: t.fuelUsedLiters || 0,
    expenseCost: t.expenseCost || 0,
    startTime: t.created_at || t.startTime || new Date().toISOString(),
    progressPercent: t.progressPercent || 0,
  }));
});

export const createTrip = createAsyncThunk('trips/create', async (data: any) => {
  const response = await api.post('/trips', data);
  const t = response.data.data;
  return {
    id: t.id,
    vehicleName: t.vehicle?.name || t.vehicle?.model || 'Unknown Vehicle',
    vehicleRegNo: t.vehicle?.registration_number || t.vehicle_id,
    driverName: t.driver?.name || 'Unknown Driver',
    driverId: t.driver_id,
    status: t.status || 'Draft',
    eta: t.eta || 'Unknown',
    etaMinutes: t.etaMinutes || 0,
    source: t.source,
    destination: t.destination,
    currentLocation: t.currentLocation || t.source,
    cargoWeightKg: t.cargo_weight || t.cargoWeightKg || 0,
    distanceKm: t.planned_distance || t.distanceKm || 0,
    fuelUsedLiters: t.fuelUsedLiters || 0,
    expenseCost: t.expenseCost || 0,
    startTime: t.created_at || t.startTime || new Date().toISOString(),
    progressPercent: t.progressPercent || 0,
  };
});

export const updateTripStatusAPI = createAsyncThunk('trips/updateStatus', async ({ id, status }: any) => {
  const response = await api.patch(`/trips/${id}/status`, { status });
  const t = response.data.data;
  return {
    id: t.id || id,
    status: t.status || status,
    progressPercent: status === 'COMPLETED' ? 100 : (status === 'IN_PROGRESS' || status === 'ON_TRIP' || status === 'On Trip' ? 50 : 0),
  };
});

export const completeTripAPI = createAsyncThunk('trips/complete', async ({ id, data }: any) => {
  const response = await api.patch(`/trips/${id}/complete`, data);
  const t = response.data.data;
  return {
    id: t.id || id,
    status: t.status || 'Completed',
    progressPercent: 100,
  };
});

export const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.unshift(action.payload);
    },
    updateTripStatus: (state, action: PayloadAction<{ id: string; status: Trip['status']; currentLocation?: string; progressPercent?: number }>) => {
      const trip = state.trips.find(t => t.id === action.payload.id);
      if (trip) {
        trip.status = action.payload.status;
        if (action.payload.currentLocation !== undefined) {
          trip.currentLocation = action.payload.currentLocation;
        }
        if (action.payload.progressPercent !== undefined) {
          trip.progressPercent = action.payload.progressPercent;
        }
      }
    },
    deleteTrip: (state, action: PayloadAction<string>) => {
      state.trips = state.trips.filter(t => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch trips';
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.trips.unshift(action.payload);
      })
      .addCase(updateTripStatusAPI.fulfilled, (state, action) => {
        const trip = state.trips.find(t => t.id === action.payload.id);
        if (trip) {
          trip.status = action.payload.status;
          trip.progressPercent = action.payload.progressPercent;
        }
      })
      .addCase(completeTripAPI.fulfilled, (state, action) => {
        const trip = state.trips.find(t => t.id === action.payload.id);
        if (trip) {
          trip.status = action.payload.status;
          trip.progressPercent = action.payload.progressPercent;
        }
      });
  },
});

export const { addTrip, updateTripStatus, deleteTrip } = tripSlice.actions;
export default tripSlice.reducer;
