import { z } from 'zod';

export const createDriverSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email().optional(),
    phone: z.string().min(1, 'Phone is required'),
    license_number: z.string().min(1, 'License number is required'),
    license_category: z.string().min(1, 'License category is required'),
    license_expiry: z.string().min(1, 'License expiry date is required'),
    date_of_birth: z.string().optional(),
    blood_group: z.string().optional(),
    address: z.string().optional(),
    emergency_contact: z.string().optional(),
});

export const updateDriverSchema = createDriverSchema.partial();