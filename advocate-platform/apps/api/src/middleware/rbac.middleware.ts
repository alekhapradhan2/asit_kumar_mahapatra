import { Request, Response, NextFunction } from 'express';
import type { Role } from '@advocate/shared-types';
import { AppError } from '../utils/AppError';

/**
 * Require one or more roles. Must be used AFTER authenticate middleware.
 *
 * Usage:
 *   router.get('/admin/clients', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), handler)
 */
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(
        new AppError(
          `Access denied. Required role(s): ${roles.join(', ')}`,
          403
        )
      );
    }

    next();
  };
}

/**
 * Ensure the authenticated client can only access their OWN resource.
 * For admin roles, this check is bypassed.
 *
 * @param getClientId - function that extracts the clientId from the request
 *                      (from params, body, or a DB lookup result)
 */
export function requireOwnership(
  getClientId: (req: Request) => string | undefined | null
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    // Admins bypass ownership check
    if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN') {
      return next();
    }

    const resourceClientId = getClientId(req);

    if (!resourceClientId || resourceClientId !== req.user.clientId) {
      return next(new AppError('Access denied. You do not own this resource.', 403));
    }

    next();
  };
}
