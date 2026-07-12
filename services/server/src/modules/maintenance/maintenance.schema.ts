import { z } from 'zod';

export const createMaintenanceSchema = z.object({
    vehicle_id: z.string().uuid('Invalid vehicle ID'),
    type: z.string().min(1, 'Maintenance type is required'),
    description: z.string().optional(),
    service_center: z.string().optional(),
    cost: z.number().min(0).optional(),
    start_odometer: z.number().optional(),
});