import { Router } from 'express';
import { DocumentController } from './document.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { uploadMultiple } from '../../middleware/upload.middleware';

const router = Router();
const controller = new DocumentController();

router.use(authenticate);

router.get('/vehicle/:vehicleId', controller.getByVehicle);
router.post('/upload', authorize('FLEET_MANAGER'), uploadMultiple, controller.upload);
router.patch('/:id/verify', authorize('SAFETY_OFFICER', 'FLEET_MANAGER'), controller.verify);
router.delete('/:id', authorize('FLEET_MANAGER'), controller.delete);

export { router as documentRoutes };