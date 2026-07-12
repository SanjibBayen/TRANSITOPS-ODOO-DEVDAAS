import { Request, Response } from 'express';
import { UserService } from './user.service';
import { NotificationService } from '../../services/notification.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class UserController {
  private userService = new UserService();

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getAll();
    res.json({ success: true, data: users });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getById(req.params.id);
    res.json({ success: true, data: user });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.update(req.params.id, req.body);
    res.json({ success: true, data: user });
  });

  deactivate = asyncHandler(async (req: Request, res: Response) => {
    await this.userService.deactivate(req.params.id);
    res.json({ success: true, message: 'User deactivated' });
  });

  activate = asyncHandler(async (req: Request, res: Response) => {
    await this.userService.activate(req.params.id);
    res.json({ success: true, message: 'User activated' });
  });

  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await NotificationService.getUserNotifications(req.params.id);
    res.json({ success: true, data: notifications });
  });

  markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
    await NotificationService.markAsRead(req.params.notificationId, req.params.id);
    res.json({ success: true, message: 'Notification marked as read' });
  });

  markAllNotificationsRead = asyncHandler(async (req: Request, res: Response) => {
    await NotificationService.markAllAsRead(req.params.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  });
}