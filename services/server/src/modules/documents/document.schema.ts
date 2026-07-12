import { z } from 'zod';

export const uploadDocumentSchema = z.object({
  vehicle_id: z.string().uuid('Invalid vehicle ID'),
  type: z.enum(['REGISTRATION', 'INSURANCE', 'PERMIT', 'POLLUTION', 'LICENSE', 'MAINTENANCE_RECORD', 'OTHER']),
  title: z.string().min(1, 'Title is required'),
});