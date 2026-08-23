import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

export const clientLoginSchema = z
  .object({
    email: z.string().email().optional(),
    clientId: z.string().optional(),
    identifier: z.string().optional(),
    password: z.string().min(1, 'Password required'),
  })
  .refine((data) => data.email || data.clientId || data.identifier, {
    message: 'Either email, clientId, or identifier must be provided',
    path: ['email'],
  });

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ClientLoginInput = z.infer<typeof clientLoginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
