import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/AppError';
import * as AuthService from './auth.service';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth',
};

// POST /api/v1/auth/admin/login
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.adminLogin(
    email,
    password,
    req.ip,
    req.headers['user-agent']
  );

  res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

  sendSuccess(res, {
    accessToken: result.accessToken,
    user: result.user,
  }, 'Login successful');
});

// POST /api/v1/auth/client/login
export const clientLogin = asyncHandler(async (req: Request, res: Response) => {
  const { clientId, email, identifier, password } = req.body;
  const loginIdentifier = (email || clientId || identifier) as string;

  if (!loginIdentifier) {
    throw new AppError('Email or Client ID is required', 400);
  }

  const result = await AuthService.clientLogin(
    loginIdentifier,
    password,
    req.ip,
    req.headers['user-agent']
  );

  res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

  sendSuccess(res, {
    accessToken: result.accessToken,
    user: result.user,
  }, 'Login successful');
});

// POST /api/v1/auth/refresh
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  // Accept from cookie (preferred) or body (for non-browser clients)
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    throw new AppError('Refresh token required', 401);
  }

  const result = await AuthService.rotateRefreshToken(
    token,
    req.ip,
    req.headers['user-agent']
  );

  res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

  sendSuccess(res, { accessToken: result.accessToken }, 'Token refreshed');
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (token) {
    await AuthService.revokeRefreshToken(token);
  }

  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  sendSuccess(res, null, 'Logged out successfully');
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { sub, role, clientId } = req.user;
  sendSuccess(res, { id: sub, role, clientId }, 'Current user retrieved');
});
