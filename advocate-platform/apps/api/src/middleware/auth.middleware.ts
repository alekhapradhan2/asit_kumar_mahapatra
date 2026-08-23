import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/database';
import type { AuthTokenPayload } from '@advocate/shared-types';
import { AppError } from '../utils/AppError';

// Extend Express Request to carry authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

/**
 * Validates the Bearer JWT in the Authorization header.
 * Attaches decoded payload to req.user.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No authentication token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    let payload: AuthTokenPayload;
    try {
      payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload;
    } catch {
      throw new AppError('Invalid or expired token', 401);
    }

    // Verify user still active in DB
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new AppError('Account is inactive or not found', 401);
    }

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Optional authentication — attaches user if token present, but doesn't fail if missing.
 * Use for public routes that show extra info when logged in.
 */
export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload;
      req.user = payload;
    } catch {
      // Token invalid — just continue without user
    }

    next();
  } catch (err) {
    next(err);
  }
}
