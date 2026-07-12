import { Router } from 'express';
import { TripController } from './trip.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createTripSchema } from './trip.schema';

const router = Router();
const controller = new TripController();

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorize('FLEET_MANAGER'), validate(createTripSchema), controller.create);
router.patch('/:id/status', controller.updateStatus);
router.patch('/:id/complete', controller.completeTrip);

export { router as tripRoutes };