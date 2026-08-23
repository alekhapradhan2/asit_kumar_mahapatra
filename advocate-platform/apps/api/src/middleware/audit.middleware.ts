import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

interface AuditOptions {
  action: string;
  resourceType: string;
  resourceId?: (req: Request) => string | undefined;
}

/**
 * Middleware factory that logs an audit record after a successful response.
 * Must be placed AFTER authenticate middleware to capture req.user.
 */
export function audit(options: AuditOptions) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const originalJson = res.json.bind(res);

    res.json = (body: unknown) => {
      // Only log on successful responses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const resourceId =
          options.resourceId ? options.resourceId(req) : req.params.id;

        prisma.auditLog
          .create({
            data: {
              userId: req.user.sub,
              action: options.action,
              resourceType: options.resourceType,
              resourceId: resourceId,
              ipAddress: req.ip,
              userAgent: req.headers['user-agent'],
            },
          })
          .catch((err) => {
            console.error('[AUDIT LOG ERROR]', err);
          });
      }

      return originalJson(body);
    };

    next();
  };
}
