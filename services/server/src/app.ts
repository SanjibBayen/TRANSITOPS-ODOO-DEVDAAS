import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.middleware';
import { 
  securityHeaders, 
  preventSqlInjection, 
  sanitizeInput, 
  requestId,
  responseTime 
} from './middleware/security.middleware';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.middleware';
import { auditMiddleware } from './middleware/audit.middleware';
import { corsOptions } from './config/cors';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/user.routes';
import { vehicleRoutes } from './modules/vehicles/vehicle.routes';
import { driverRoutes } from './modules/drivers/driver.routes';
import { tripRoutes } from './modules/trips/trip.routes';
import { maintenanceRoutes } from './modules/maintenance/maintenance.routes';
import { fuelRoutes } from './modules/fuel/fuel.routes';
import { expenseRoutes } from './modules/expenses/expense.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { dispatchRoutes } from './modules/dispatch/dispatch.routes';
import { documentRoutes } from './modules/documents/document.routes';


const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestId);
app.use(responseTime);
app.use(preventSqlInjection);
app.use(sanitizeInput);

// ============================================
// RATE LIMITING
// ============================================
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', apiLimiter);

// ============================================
// AUDIT LOGGING (for non-GET requests)
// ============================================
app.use('/api/v1', auditMiddleware);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    requestId: (req as any).requestId,
    environment: process.env.NODE_ENV || 'development',
  });
});

// ============================================
// API ROUTES
// ============================================
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/vehicles`, vehicleRoutes);
app.use(`${API_PREFIX}/drivers`, driverRoutes);
app.use(`${API_PREFIX}/trips`, tripRoutes);
app.use(`${API_PREFIX}/maintenance`, maintenanceRoutes);
app.use(`${API_PREFIX}/fuel`, fuelRoutes);
app.use(`${API_PREFIX}/expenses`, expenseRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/dispatch`, dispatchRoutes);
app.use(`${API_PREFIX}/documents`, documentRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    requestId: (req as any).requestId,
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use(errorHandler);

export default app;