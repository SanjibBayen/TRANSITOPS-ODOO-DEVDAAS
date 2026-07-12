import { Request, Response } from 'express';
import { MaintenanceService } from './maintenance.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { emitEvent } from '../../config/socket';
import { NotificationService } from '../../services/notification.service';

export class MaintenanceController {
    private service = new MaintenanceService();

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const records = await this.service.getAll(req.query as any);
        res.json({ success: true, data: records });
    });

    getActive = asyncHandler(async (req: Request, res: Response) => {
        const records = await this.service.getActive();
        res.json({ success: true, data: records });
    });

    create = asyncHandler(async (req: Request, res: Response) => {
  const record = await this.service.create(req.body);
  
  // WebSocket events
  emitEvent.maintenanceCreated(record);
  emitEvent.vehicleStatusChanged(req.body.vehicle_id, 'IN_SHOP');
  emitEvent.dashboardRefresh();
  
  res.status(201).json({ success: true, data: record });
});

   complete = asyncHandler(async (req: Request, res: Response) => {
  const record = await this.service.complete(req.params.id);
  
  // WebSocket events
  emitEvent.vehicleStatusChanged(record.vehicle_id, 'AVAILABLE');
  emitEvent.dashboardRefresh();
  
  res.json({ success: true, data: record });
});
};