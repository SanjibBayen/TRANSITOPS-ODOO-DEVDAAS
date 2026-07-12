import { Router } from 'express';
import { DriverController } from './driver.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createDriverSchema, updateDriverSchema } from './driver.schema';

const router = Router();
const controller = new DriverController();

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/available', controller.getAvailable);
router.get('/expiring-licenses', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), controller.getExpiringLicenses);
router.get('/:id', controller.getById);
router.post('/', authorize('FLEET_MANAGER'), validate(createDriverSchema), controller.create);
router.put('/:id', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), validate(updateDriverSchema), controller.update);
router.patch('/:id/status', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), controller.updateStatus);

export { router as driverRoutes };