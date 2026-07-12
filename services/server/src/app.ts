import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.middleware';
import { authRoutes } from './modules/auth/auth.routes';
import { vehicleRoutes } from './modules/vehicles/vehicle.routes';
import { driverRoutes } from './modules/drivers/driver.routes';
import { tripRoutes } from './modules/trips/trip.routes';
import { maintenanceRoutes } from './modules/maintenance/maintenance.routes';
import { fuelRoutes } from './modules/fuel/fuel.routes';
import { expenseRoutes } from './modules/expenses/expense.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { dispatchRoutes } from './modules/dispatch/dispatch.routes';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/vehicles`, vehicleRoutes);
app.use(`${API_PREFIX}/drivers`, driverRoutes);
app.use(`${API_PREFIX}/trips`, tripRoutes);
app.use(`${API_PREFIX}/maintenance`, maintenanceRoutes);
app.use(`${API_PREFIX}/fuel`, fuelRoutes);
app.use(`${API_PREFIX}/expenses`, expenseRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/dispatch`, dispatchRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Error Handler
app.use(errorHandler);

export default app;