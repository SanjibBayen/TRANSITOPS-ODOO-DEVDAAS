import { z } from 'zod';

export const createTripSchema = z.object({
    source: z.string().min(1, 'Source is required'),
    destination: z.string().min(1, 'Destination is required'),
    cargo_weight: z.number().positive('Cargo weight must be positive'),
    planned_distance: z.number().positive('Planned distance must be positive'),
    cargo_type: z.string().optional(),
    vehicle_id: z.string().uuid('Invalid vehicle ID'),
    driver_id: z.string().uuid('Invalid driver ID'),
    planned_start_date: z.string().optional(),
    start_odometer: z.number().optional(),
});