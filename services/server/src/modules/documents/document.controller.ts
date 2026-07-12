import { Request, Response } from 'express';
import { DocumentService } from './document.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class DocumentController {
  private service = new DocumentService();

  getByVehicle = asyncHandler(async (req: Request, res: Response) => {
    const docs = await this.service.getByVehicle(req.params.vehicleId);
    res.json({ success: true, data: docs });
  });

  upload = asyncHandler(async (req: Request, res: Response) => {
    const docs = await this.service.upload(req.body.vehicle_id, req.body.type, req.body.title, req.files as Express.Multer.File[]);
    res.status(201).json({ success: true, data: docs });
  });

  verify = asyncHandler(async (req: Request, res: Response) => {
    const doc = await this.service.verify(req.params.id, req.user!.id);
    res.json({ success: true, data: doc });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    res.json({ success: true, message: 'Document deleted' });
  });
}