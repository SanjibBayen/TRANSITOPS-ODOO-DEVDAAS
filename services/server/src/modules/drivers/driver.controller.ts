import { Request, Response } from "express";
import { DriverService } from "./driver.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { emitEvent } from "../../config/socket";
import { NotificationService } from "../../services/notification.service";

export class DriverController {
  private service = new DriverService();

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const drivers = await this.service.getAll(req.query as any);
    res.json({ success: true, data: drivers });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const driver = await this.service.getById(req.params.id);
    res.json({ success: true, data: driver });
  });

  getAvailable = asyncHandler(async (req: Request, res: Response) => {
    const drivers = await this.service.getAvailable();
    res.json({ success: true, data: drivers });
  });

  getExpiringLicenses = asyncHandler(async (req: Request, res: Response) => {
    const drivers = await this.service.getExpiringLicenses();
    res.json({ success: true, data: drivers });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const driver = await this.service.create(req.body);
    res.status(201).json({ success: true, data: driver });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const driver = await this.service.update(req.params.id, req.body);
    res.json({ success: true, data: driver });
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const driver = await this.service.updateStatus(
      req.params.id,
      req.body.status,
    );

    if (req.body.status === "SUSPENDED") {
      (emitEvent as any).complianceWarning({
        type: "DRIVER_SUSPENDED",
        driver: { id: driver.id, name: driver.name },
      });
    }

    emitEvent.dashboardRefresh();

    res.json({ success: true, data: driver });
  });
}
