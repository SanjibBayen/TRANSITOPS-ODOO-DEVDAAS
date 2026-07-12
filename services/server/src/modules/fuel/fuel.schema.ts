import { z } from 'zod';

export const createFuelLogSchema = z.object({
    vehicle_id: z.string().uuid('Invalid vehicle ID'),
    trip_id: z.string().uuid().optional(),
    liters: z.number().positive('Liters must be positive'),
    cost: z.number().min(0, 'Cost cannot be negative'),
    odometer: z.number().optional(),
    station: z.string().optional(),
    date: z.string().optional(),
});