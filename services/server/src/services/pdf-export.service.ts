import PDFDocument from 'pdfkit';
import { supabaseAdmin } from '../config/supabase';

export class PDFExportService {
  static async generateVehicleReport(): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data: vehicles } = await supabaseAdmin.from('vehicles').select('*');
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Title
        doc.fontSize(20).font('Helvetica-Bold').text('TransitOps - Vehicle Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Table
        const tableTop = 150;
        const columns = ['Reg No', 'Model', 'Type', 'Status', 'Odometer', 'Region'];
        const columnWidths = [100, 120, 80, 80, 80, 80];
        
        // Headers
        doc.font('Helvetica-Bold').fontSize(9);
        let xPos = 50;
        columns.forEach((col, i) => {
          doc.text(col, xPos, tableTop, { width: columnWidths[i], align: 'left' });
          xPos += columnWidths[i];
        });

        // Rows
        doc.font('Helvetica').fontSize(8);
        let yPos = tableTop + 20;
        vehicles?.forEach((vehicle: any) => {
          if (yPos > 750) {
            doc.addPage();
            yPos = 50;
          }
          xPos = 50;
          const row = [
            vehicle.registration_number,
            vehicle.model,
            vehicle.type,
            vehicle.status,
            String(vehicle.current_odometer),
            vehicle.region || '-'
          ];
          row.forEach((text, i) => {
            doc.text(text, xPos, yPos, { width: columnWidths[i], align: 'left' });
            xPos += columnWidths[i];
          });
          yPos += 18;
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  static async generateTripReport(filters?: any): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        let query = supabaseAdmin.from('trips').select('*, vehicle:vehicles(registration_number), driver:drivers(name)');
        if (filters?.status) query = query.eq('status', filters.status);
        const { data: trips } = await query;

        const doc = new PDFDocument({ margin: 50, layout: 'landscape' });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        doc.fontSize(18).font('Helvetica-Bold').text('TransitOps - Trip Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(9).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        const tableTop = 120;
        const columns = ['Trip#', 'Source', 'Destination', 'Vehicle', 'Driver', 'Cargo(kg)', 'Status', 'Revenue'];
        const columnWidths = [90, 100, 100, 90, 90, 65, 75, 70];
        
        doc.font('Helvetica-Bold').fontSize(8);
        let xPos = 50;
        columns.forEach((col, i) => {
          doc.text(col, xPos, tableTop, { width: columnWidths[i] });
          xPos += columnWidths[i];
        });

        doc.font('Helvetica').fontSize(7);
        let yPos = tableTop + 18;
        trips?.forEach((trip: any) => {
          if (yPos > 520) {
            doc.addPage();
            yPos = 50;
          }
          xPos = 50;
          const row = [
            trip.trip_number,
            trip.source,
            trip.destination,
            trip.vehicle?.registration_number || '-',
            trip.driver?.name || '-',
            String(trip.cargo_weight),
            trip.status,
            `₹${trip.revenue || 0}`
          ];
          row.forEach((text, i) => {
            doc.text(text, xPos, yPos, { width: columnWidths[i] });
            xPos += columnWidths[i];
          });
          yPos += 16;
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}