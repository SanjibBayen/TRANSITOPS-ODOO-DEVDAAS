import { Request, Response } from 'express';
import { TripService } from './trip.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class TripController {
    private service = new TripService();

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const trips = await this.service.getAll(req.query as any, req.user!);
        res.json({ success: true, data: trips });
    });

    getById = asyncHandler(async (req: Request, res: Response) => {
        const trip = await this.service.getById(req.params.id);
        res.json({ success: true, data: trip });
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const trip = await this.service.create(req.body, req.user!.id);
        res.status(201).json({ success: true, data: trip });
    });

    updateStatus = asyncHandler(async (req: Request, res: Response) => {
        const trip = await this.service.updateStatus(req.params.id, req.body.status, req.user!.id);
        res.json({ success: true, data: trip });
    });

    completeTrip = asyncHandler(async (req: Request, res: Response) => {
        const trip = await this.service.completeTrip(req.params.id, req.body);
        res.json({ success: true, data: trip });
    });
}