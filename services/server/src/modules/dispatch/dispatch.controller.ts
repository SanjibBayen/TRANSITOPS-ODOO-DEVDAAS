import { Request, Response } from 'express';
import { DispatchService } from './dispatch.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { emitEvent } from '../../config/socket';
import { NotificationService } from '../../services/notification.service';

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
  
  // WebSocket events
  emitEvent.tripDispatched(trip, trip.driver?.user_id);
  emitEvent.vehicleStatusChanged(trip.vehicle_id, 'ON_TRIP');
  emitEvent.dashboardRefresh();
  
  // Send notification to driver
  if (trip.driver?.user_id) {
    await NotificationService.create({
      userId: trip.driver.user_id,
      title: 'New Trip Assigned',
      message: `Trip ${trip.trip_number}: ${trip.source} → ${trip.destination}`,
      type: 'SUCCESS',
      link: `/trips/${trip.id}`,
    });
  }
  
  res.json({ success: true, data: trip });
});
};