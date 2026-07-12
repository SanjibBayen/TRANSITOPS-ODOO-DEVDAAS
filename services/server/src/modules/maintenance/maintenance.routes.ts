import { Router } from 'express';
import { MaintenanceController } from './maintenance.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createMaintenanceSchema } from './maintenance.schema';

const router = Router();
const controller = new MaintenanceController();

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/active', controller.getActive);
router.post('/', authorize('FLEET_MANAGER'), validate(createMaintenanceSchema), controller.create);
router.patch('/:id/complete', authorize('FLEET_MANAGER'), controller.complete);

export { router as maintenanceRoutes };