import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export type TripStatus = 'DRAFT' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
  id: string;
  trip_number: string;
  vehicleName: string;
  vehicleRegNo: string;
  driverName: string;
  driverId: string;
  status: TripStatus;
  eta: string;
  etaMinutes: number;
  source: string;
  destination: string;
  currentLocation: string;
  cargoWeightKg: number;
  distanceKm: number;
  fuelUsedLiters: number;
  expenseCost: number;
  startTime: string;
  progressPercent: number;
  vehicle_id: string;
  driver_id: string;
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

// Map backend status to progress
const statusProgress: Record<string, number> = {
  DRAFT: 0,
  DISPATCHED: 25,
  IN_PROGRESS: 50,
  COMPLETED: 100,
  CANCELLED: 0,
};

// Map backend trip to frontend format
const mapTrip = (t: any): Trip => ({
  id: t.id,
  trip_number: t.trip_number || '',
  vehicleName: t.vehicle?.registration_number || t.vehicle?.model || 'Unknown',
  vehicleRegNo: t.vehicle?.registration_number || t.vehicle_id,
  driverName: t.driver?.name || 'Unknown',
  driverId: t.driver_id,
  status: t.status as TripStatus,
  eta: t.eta || '--',
  etaMinutes: t.etaMinutes || 0,
  source: t.source,
  destination: t.destination,
  currentLocation: t.currentLocation || t.source,
  cargoWeightKg: t.cargo_weight || 0,
  distanceKm: t.planned_distance || 0,
  fuelUsedLiters: 0,
  expenseCost: 0,
  startTime: t.actual_start_date || t.created_at || new Date().toISOString(),
  progressPercent: statusProgress[t.status] || 0,
  vehicle_id: t.vehicle_id,
  driver_id: t.driver_id,
});

export const fetchTrips = createAsyncThunk('trips/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/trips');
    return (response.data.data || []).map(mapTrip);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch trips');
  }
});

export const createTrip = createAsyncThunk('trips/create', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/trips', data);
    return mapTrip(response.data.data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create trip');
  }
});

export const updateTripStatusAPI = createAsyncThunk('trips/updateStatus', async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/trips/${id}/status`, { status });
    return { id, status, progressPercent: statusProgress[status] || 0 };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update status');
  }
});

export const completeTripAPI = createAsyncThunk('trips/complete', async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/trips/${id}/complete`, data);
    return { id, status: 'COMPLETED', progressPercent: 100 };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to complete trip');
  }
});

export const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.unshift(action.payload);
    },
    deleteTrip: (state, action: PayloadAction<string>) => {
      state.trips = state.trips.filter(t => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTrips.fulfilled, (state, action) => { state.isLoading = false; state.trips = action.payload; })
      .addCase(fetchTrips.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(createTrip.fulfilled, (state, action) => { state.trips.unshift(action.payload); })
      .addCase(updateTripStatusAPI.fulfilled, (state, action) => {
        const trip = state.trips.find(t => t.id === action.payload.id);
        if (trip) {
          trip.status = action.payload.status as TripStatus;
          trip.progressPercent = action.payload.progressPercent;
        }
      })
      .addCase(completeTripAPI.fulfilled, (state, action) => {
        const trip = state.trips.find(t => t.id === action.payload.id);
        if (trip) {
          trip.status = 'COMPLETED';
          trip.progressPercent = 100;
        }
      });
  },
});

export const { addTrip, deleteTrip } = tripSlice.actions;
export default tripSlice.reducer;