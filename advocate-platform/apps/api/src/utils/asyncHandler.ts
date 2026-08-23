import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers to automatically catch errors and pass to next().
 * Eliminates try/catch boilerplate in every controller.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
