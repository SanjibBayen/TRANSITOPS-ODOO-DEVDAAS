import { Request, Response } from 'express';
import { FuelService } from './fuel.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class FuelController {
    private service = new FuelService();

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const logs = await this.service.getAll(req.query as any);
        res.json({ success: true, data: logs });
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const log = await this.service.create(req.body);
        res.status(201).json({ success: true, data: log });
    });
}