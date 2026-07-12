import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { asyncHandler } from '../../utils/asyncHandler';


export class AnalyticsController {
    private service = new AnalyticsService();

    getDashboard = asyncHandler(async (req: Request, res: Response) => {
        const data = await this.service.getDashboard(req.user!);
        res.json({ success: true, data });
    });

    getFleetUtilization = asyncHandler(async (req: Request, res: Response) => {
        const data = await this.service.getFleetUtilization();
        res.json({ success: true, data });
    });

    getVehicleCosts = asyncHandler(async (req: Request, res: Response) => {
        const data = await this.service.getVehicleCosts();
        res.json({ success: true, data });
    });

    getVehicleROI = asyncHandler(async (req: Request, res: Response) => {
        const data = await this.service.getVehicleROI();
        res.json({ success: true, data });
    });
}