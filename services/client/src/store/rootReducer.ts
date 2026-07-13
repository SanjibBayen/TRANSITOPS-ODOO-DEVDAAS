import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vehicleReducer from './slices/vehicleSlice';
import driverReducer from './slices/driverSlice';
import tripReducer from './slices/tripSlice';
import uiReducer from './slices/uiSlice';
import expenseReducer from './slices/expenseSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import fuelReducer from './slices/fuelSlice';
import analyticsReducer from './slices/analyticsSlice';
import dispatchReducer from './slices/dispatchSlice';
import documentReducer from './slices/documentSlice';
import notificationReducer from './slices/notificationSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  vehicles: vehicleReducer,
  drivers: driverReducer,
  trips: tripReducer,
  ui: uiReducer,
  expenses: expenseReducer,
  maintenance: maintenanceReducer,
  fuel: fuelReducer,
  analytics: analyticsReducer,
  dispatch: dispatchReducer,
  documents: documentReducer,
  notifications: notificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;