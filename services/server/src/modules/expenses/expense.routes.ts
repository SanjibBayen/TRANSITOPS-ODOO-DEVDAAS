import { Router } from 'express';
import { ExpenseController } from './expense.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createExpenseSchema } from './expense.schema';

const router = Router();
const controller = new ExpenseController();

router.use(authenticate);

router.get('/', controller.getAll);
router.post('/', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), validate(createExpenseSchema), controller.create);

export { router as expenseRoutes };