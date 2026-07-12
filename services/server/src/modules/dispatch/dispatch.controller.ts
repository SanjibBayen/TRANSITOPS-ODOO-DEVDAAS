import { Request, Response } from 'express';
import { DispatchService } from './dispatch.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class DispatchController {
    private service = new DispatchService();

    getAvailableResources = asyncHandler(async (req: Request, res: Response) => {
        const resources = await this.service.getAvailableResources();
        res.json({ success: true, data: resources });
    });

    validateDispatch = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.service.validateDispatch(req.body);
        res.json({ success: true, data: result });
    });

    dispatchTrip = asyncHandler(async (req: Request, res: Response) => {
        const trip = await this.service.dispatchTrip(req.params.tripId, req.user!.id);
        res.json({ success: true, data: trip });
    });
}