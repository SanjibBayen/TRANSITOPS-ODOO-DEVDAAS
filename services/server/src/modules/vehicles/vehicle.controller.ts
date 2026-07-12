import { Request, Response } from 'express';
import { VehicleService } from './vehicle.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class VehicleController {
    private service = new VehicleService();

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const vehicles = await this.service.getAll(req.query as any);
        res.json({ success: true, data: vehicles });
    });

    getById = asyncHandler(async (req: Request, res: Response) => {
        const vehicle = await this.service.getById(req.params.id);
        res.json({ success: true, data: vehicle });
    });

    getAvailable = asyncHandler(async (req: Request, res: Response) => {
        const vehicles = await this.service.getAvailable();
        res.json({ success: true, data: vehicles });
    });

    getStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await this.service.getStats();
        res.json({ success: true, data: stats });
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const vehicle = await this.service.create(req.body);
        res.status(201).json({ success: true, data: vehicle });
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const vehicle = await this.service.update(req.params.id, req.body);
        res.json({ success: true, data: vehicle });
    });

    updateStatus = asyncHandler(async (req: Request, res: Response) => {
        const vehicle = await this.service.updateStatus(req.params.id, req.body.status);
        res.json({ success: true, data: vehicle });
    });
}