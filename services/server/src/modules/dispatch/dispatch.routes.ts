import { Router } from 'express';
import { DispatchController } from './dispatch.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const controller = new DispatchController();

router.use(authenticate);
router.use(authorize('FLEET_MANAGER'));

router.get('/available-resources', controller.getAvailableResources);
router.post('/validate', controller.validateDispatch);
router.post('/dispatch/:tripId', controller.dispatchTrip);

export { router as dispatchRoutes };