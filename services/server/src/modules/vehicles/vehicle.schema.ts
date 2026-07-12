import { z } from 'zod';

export const createVehicleSchema = z.object({
    registration_number: z.string().min(1, 'Registration number is required'),
    model: z.string().min(1, 'Model is required'),
    type: z.string().min(1, 'Type is required'),
    max_load_capacity: z.number().positive('Capacity must be positive'),
    acquisition_cost: z.number().positive('Cost must be positive').optional(),
    brand: z.string().optional(),
    year: z.number().optional(),
    region: z.string().optional(),
    color: z.string().optional(),
    fuel_type: z.string().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();