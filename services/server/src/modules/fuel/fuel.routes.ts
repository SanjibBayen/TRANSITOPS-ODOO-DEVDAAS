import { Router } from 'express';
import { FuelController } from './fuel.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createFuelLogSchema } from './fuel.schema';

const router = Router();
const controller = new FuelController();

router.use(authenticate);

router.get('/', controller.getAll);
router.post('/', validate(createFuelLogSchema), controller.create);

export { router as fuelRoutes };