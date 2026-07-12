import { Request, Response } from 'express';
import { MaintenanceService } from './maintenance.service';
import { asyncHandler } from '../../utils/asyncHandler';

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
        res.status(201).json({ success: true, data: record });
    });

    complete = asyncHandler(async (req: Request, res: Response) => {
        const record = await this.service.complete(req.params.id);
        res.json({ success: true, data: record });
    });
}