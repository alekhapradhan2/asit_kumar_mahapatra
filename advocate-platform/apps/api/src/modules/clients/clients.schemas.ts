import { z } from 'zod';

export const createClientSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  mobile: z.string().regex(/^\+?[0-9\s\-]{7,15}$/, 'Invalid mobile number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).default('India'),
  pinCode: z.string().max(10).optional(),
  dateOfBirth: z.string().datetime().optional().nullable(),
  emergencyName: z.string().max(100).optional(),
  emergencyPhone: z.string().max(20).optional(),
});

export const updateClientSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  mobile: z.string().regex(/^\+?[0-9\s\-]{7,15}$/).optional(),
  address: z.string().max(300).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional(),
  pinCode: z.string().max(10).optional().nullable(),
  emergencyName: z.string().max(100).optional().nullable(),
  emergencyPhone: z.string().max(20).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const clientQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['createdAt', 'fullName', 'clientId']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientQuery = z.infer<typeof clientQuerySchema>;
