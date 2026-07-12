import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import vehicleReducer from './slices/vehicleSlice.ts';
import driverReducer from './slices/driverSlice.ts';
import tripReducer from './slices/tripSlice.ts';
import uiReducer from './slices/uiSlice.ts';
import expenseReducer from './slices/expenseSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehicleReducer,
    drivers: driverReducer,
    trips: tripReducer,
    ui: uiReducer,
    expenses: expenseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
