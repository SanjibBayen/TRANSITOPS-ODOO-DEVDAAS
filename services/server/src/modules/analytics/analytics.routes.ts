import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const controller = new AnalyticsController();

router.use(authenticate);

router.get('/dashboard', controller.getDashboard);
router.get('/fleet-utilization', controller.getFleetUtilization);
router.get('/vehicle-costs', controller.getVehicleCosts);
router.get('/vehicle-roi', controller.getVehicleROI);

export { router as analyticsRoutes };