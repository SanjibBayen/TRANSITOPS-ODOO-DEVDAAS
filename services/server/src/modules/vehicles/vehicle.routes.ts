import { Router, Request, Response } from 'express';
import { VehicleController } from './vehicle.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createVehicleSchema, updateVehicleSchema } from './vehicle.schema';
import { uploadCSV } from '../../middleware/upload.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { BulkImportService } from '../../services/bulk-import.service';
import { ApiError } from '../../utils/ApiError';
import fs from 'fs';

const router = Router();
const controller = new VehicleController();

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/available', controller.getAvailable);
router.get('/stats', controller.getStats);
router.get('/:id', controller.getById);

router.post(
  '/',
  authorize('FLEET_MANAGER'),
  validate(createVehicleSchema),
  controller.create
);

router.put(
  '/:id',
  authorize('FLEET_MANAGER'),
  validate(updateVehicleSchema),
  controller.update
);

router.patch(
  '/:id/status',
  authorize('FLEET_MANAGER'),
  controller.updateStatus
);

router.post(
  '/bulk-import',
  authorize('FLEET_MANAGER'),
  uploadCSV,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, 'CSV file required');
    }

    const csvContent = fs.readFileSync(req.file.path, 'utf-8');
    const result = await BulkImportService.importVehiclesFromCSV(csvContent);

    fs.unlinkSync(req.file.path);

    res.json({ success: true, data: result });
  })
);

export { router as vehicleRoutes };