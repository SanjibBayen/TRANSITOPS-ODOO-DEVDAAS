import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const controller = new UserController();

router.use(authenticate);

router.get('/', authorize('FLEET_MANAGER'), controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.patch('/:id/deactivate', authorize('FLEET_MANAGER'), controller.deactivate);
router.patch('/:id/activate', authorize('FLEET_MANAGER'), controller.activate);
router.get('/:id/notifications', controller.getNotifications);
router.patch('/:id/notifications/:notificationId/read', controller.markNotificationRead);
router.patch('/:id/notifications/read-all', controller.markAllNotificationsRead);

export { router as userRoutes };