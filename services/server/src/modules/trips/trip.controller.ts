import { Request, Response } from "express";
import { TripService } from "./trip.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { emitEvent } from "../../config/socket";
import { NotificationService } from "../../services/notification.service";

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
    const trip = await this.service.updateStatus(
      req.params.id,
      req.body.status,
      req.user!.id,
    );

    // WebSocket events
    if (req.body.status === "DISPATCHED") {
      emitEvent.tripDispatched(trip, trip.driver?.user_id);
      emitEvent.vehicleStatusChanged(trip.vehicle_id, "ON_TRIP");
      emitEvent.dashboardRefresh();

      // Send notification to driver
      if (trip.driver?.user_id) {
        await NotificationService.create({
          userId: trip.driver.user_id,
          title: "Trip Dispatched",
          message: `Trip ${trip.trip_number}: ${trip.source} → ${trip.destination}`,
          type: "SUCCESS",
          link: `/trips/${trip.id}`,
        });
      }
    }

    if (req.body.status === "CANCELLED") {
      emitEvent.tripStatusChanged(trip.id, "CANCELLED", trip.driver?.user_id);
      emitEvent.vehicleStatusChanged(trip.vehicle_id, "AVAILABLE");
      emitEvent.dashboardRefresh();
    }

    res.json({ success: true, data: trip });
  });

  completeTrip = asyncHandler(async (req: Request, res: Response) => {
    const trip = await this.service.completeTrip(req.params.id, req.body);

    // WebSocket events
    emitEvent.tripStatusChanged(trip.id, "COMPLETED", trip.driver?.user_id);
    emitEvent.vehicleStatusChanged(trip.vehicle_id, "AVAILABLE");
    emitEvent.dashboardRefresh();

    res.json({ success: true, data: trip });
  });
}
