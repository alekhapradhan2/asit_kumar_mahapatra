import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rateLimiter';
import * as AuthController from './auth.controller';
import {
  adminLoginSchema,
  clientLoginSchema,
} from './auth.schemas';

const router = Router();

// ─── Public auth routes (rate limited) ───────────────────────────────────────

router.post(
  '/admin/login',
  authLimiter,
  validate(adminLoginSchema),
  AuthController.adminLogin
);

router.post(
  '/client/login',
  authLimiter,
  validate(clientLoginSchema),
  AuthController.clientLogin
);

router.post('/refresh', authLimiter, AuthController.refreshToken);

router.post('/logout', AuthController.logout);

// ─── Protected routes ─────────────────────────────────────────────────────────

router.get('/me', authenticate, AuthController.getMe);

export { router as authRouter };
