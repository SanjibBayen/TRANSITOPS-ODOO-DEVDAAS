import { Router } from 'express';
import { VehicleController } from './vehicle.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createVehicleSchema, updateVehicleSchema } from './vehicle.schema';

const router = Router();
const controller = new VehicleController();

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/available', controller.getAvailable);
router.get('/stats', controller.getStats);
router.get('/:id', controller.getById);
router.post('/', authorize('FLEET_MANAGER'), validate(createVehicleSchema), controller.create);
router.put('/:id', authorize('FLEET_MANAGER'), validate(updateVehicleSchema), controller.update);
router.patch('/:id/status', authorize('FLEET_MANAGER'), controller.updateStatus);

export { router as vehicleRoutes };