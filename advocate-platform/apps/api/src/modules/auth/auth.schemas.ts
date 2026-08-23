import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

export const clientLoginSchema = z.object({
  clientId: z
    .string()
    .regex(/^CLIENT-[A-Z0-9]{6,}$/, 'Invalid Client ID format (e.g. CLIENT-ABC123)'),
  password: z.string().min(1, 'Password required'),
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
