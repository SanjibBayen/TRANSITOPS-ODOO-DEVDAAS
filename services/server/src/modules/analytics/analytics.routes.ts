import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { PDFExportService } from "../../services/pdf-export.service";

const router = Router();
const controller = new AnalyticsController();

router.get("/export/vehicles/pdf", authenticate, async (req, res) => {
  try {
    const pdf = await PDFExportService.generateVehicleReport();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=vehicle-report.pdf",
    );
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ success: false, message: "PDF generation failed" });
  }
});

router.get("/export/trips/pdf", authenticate, async (req, res) => {
  try {
    const pdf = await PDFExportService.generateTripReport(req.query);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=trip-report.pdf",
    );
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ success: false, message: "PDF generation failed" });
  }
});

router.use(authenticate);

router.get("/dashboard", controller.getDashboard);
router.get("/fleet-utilization", controller.getFleetUtilization);
router.get("/vehicle-costs", controller.getVehicleCosts);
router.get("/vehicle-roi", controller.getVehicleROI);

export { router as analyticsRoutes };
