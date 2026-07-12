import { z } from 'zod';

export const createExpenseSchema = z.object({
    vehicle_id: z.string().uuid('Invalid vehicle ID'),
    trip_id: z.string().uuid().optional(),
    type: z.enum(['FUEL', 'TOLL', 'MAINTENANCE', 'PERMIT', 'INSURANCE', 'REPAIR', 'OTHER']),
    amount: z.number().positive('Amount must be positive'),
    description: z.string().optional(),
    date: z.string().optional(),
});