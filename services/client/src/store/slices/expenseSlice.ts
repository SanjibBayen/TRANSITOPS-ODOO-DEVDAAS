import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios.ts';

export interface FuelLog {
  id: string;
  vehicleId: string;
  vehicleName: string;
  liters: number;
  cost: number;
  date: string;
  vendor: string;
  fuelType: 'Diesel' | 'Petrol' | 'EV Charge' | 'CNG' | string;
}

export interface TollExpense {
  id: string;
  tripId: string;
  vehicleId: string;
  amount: number;
  tollBooth: string;
  date: string;
  notes: string;
}

export interface MaintenanceExpense {
  id: string;
  maintenanceId: string; // Connected to a Maintenance record
  vehicleId: string;
  vendor: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
}

interface ExpenseState {
  fuelLogs: FuelLog[];
  tollExpenses: TollExpense[];
  maintenanceExpenses: MaintenanceExpense[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  fuelLogs: [],
  tollExpenses: [],
  maintenanceExpenses: [],
  isLoading: false,
  error: null
};

export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async () => {
  const response = await api.get('/expenses');
  const expenses = response.data.data;
  return {
    maintenanceExpenses: expenses.filter((e: any) => e.type === 'MAINTENANCE').map((e: any) => ({
      id: e.id,
      maintenanceId: e.trip_id || e.id,
      vehicleId: e.vehicle_id,
      vendor: 'Unknown Vendor',
      category: e.type,
      amount: e.amount,
      date: e.created_at,
      notes: e.description || '',
    })),
    tollExpenses: expenses.filter((e: any) => e.type === 'TOLL').map((e: any) => ({
      id: e.id,
      tripId: e.trip_id,
      vehicleId: e.vehicle_id,
      amount: e.amount,
      tollBooth: 'Unknown Booth',
      date: e.created_at,
      notes: e.description || '',
    })),
  };
});

export const createExpense = createAsyncThunk('expenses/create', async (data: any) => {
  const response = await api.post('/expenses', data);
  const e = response.data.data;
  if (e.type === 'MAINTENANCE') {
    return {
      type: 'MAINTENANCE',
      data: {
        id: e.id,
        maintenanceId: e.trip_id || e.id,
        vehicleId: e.vehicle_id,
        vendor: 'Unknown Vendor',
        category: e.type,
        amount: e.amount,
        date: e.created_at,
        notes: e.description || '',
      }
    };
  } else {
    return {
      type: 'TOLL',
      data: {
        id: e.id,
        tripId: e.trip_id,
        vehicleId: e.vehicle_id,
        amount: e.amount,
        tollBooth: 'Unknown Booth',
        date: e.created_at,
        notes: e.description || '',
      }
    };
  }
});

export const fetchFuelLogs = createAsyncThunk('expenses/fetchFuel', async () => {
  const response = await api.get('/fuel');
  return response.data.data.map((f: any) => ({
    id: f.id,
    vehicleId: f.vehicle_id,
    vehicleName: f.vehicle?.name || f.vehicle?.model || 'Unknown',
    liters: f.liters,
    cost: f.cost,
    date: f.created_at,
    vendor: f.station || 'Unknown',
    fuelType: 'Diesel',
  }));
});

export const createFuelLog = createAsyncThunk('expenses/createFuel', async (data: any) => {
  const response = await api.post('/fuel', data);
  const f = response.data.data;
  return {
    id: f.id,
    vehicleId: f.vehicle_id,
    vehicleName: f.vehicle?.name || f.vehicle?.model || 'Unknown',
    liters: f.liters,
    cost: f.cost,
    date: f.created_at,
    vendor: f.station || 'Unknown',
    fuelType: 'Diesel',
  };
});


export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Fuel Log Reducers
    updateFuelLog: (state, action: PayloadAction<FuelLog>) => {
      const index = state.fuelLogs.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.fuelLogs[index] = action.payload;
      }
    },
    deleteFuelLog: (state, action: PayloadAction<string>) => {
      state.fuelLogs = state.fuelLogs.filter(f => f.id !== action.payload);
    },

    // Toll Expense Reducers
    updateTollExpense: (state, action: PayloadAction<TollExpense>) => {
      const index = state.tollExpenses.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tollExpenses[index] = action.payload;
      }
    },
    deleteTollExpense: (state, action: PayloadAction<string>) => {
      state.tollExpenses = state.tollExpenses.filter(t => t.id !== action.payload);
    },

    // Maintenance Expense Reducers
    updateMaintenanceExpense: (state, action: PayloadAction<MaintenanceExpense>) => {
      const index = state.maintenanceExpenses.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.maintenanceExpenses[index] = action.payload;
      }
    },
    deleteMaintenanceExpense: (state, action: PayloadAction<string>) => {
      state.maintenanceExpenses = state.maintenanceExpenses.filter(m => m.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.maintenanceExpenses = action.payload.maintenanceExpenses;
        state.tollExpenses = action.payload.tollExpenses;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        if (action.payload.type === 'MAINTENANCE') {
          state.maintenanceExpenses.unshift(action.payload.data as MaintenanceExpense);
        } else {
          state.tollExpenses.unshift(action.payload.data as TollExpense);
        }
      })
      .addCase(fetchFuelLogs.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchFuelLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fuelLogs = action.payload;
      })
      .addCase(fetchFuelLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch fuel logs';
      })
      .addCase(createFuelLog.fulfilled, (state, action) => {
        state.fuelLogs.unshift(action.payload);
      });
  }
});

export const {
  setLoading,
  setError,
  updateFuelLog,
  deleteFuelLog,
  updateTollExpense,
  deleteTollExpense,
  updateMaintenanceExpense,
  deleteMaintenanceExpense
} = expenseSlice.actions;

export default expenseSlice.reducer;
