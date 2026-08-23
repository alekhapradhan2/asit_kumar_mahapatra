import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

/**
 * Global error handler — last middleware in the chain.
 * Never leaks internal stack traces to clients in production.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: string[] | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  // Log the full error server-side
  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.path}`, {
      error: err.message,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: env.NODE_ENV === 'production' && statusCode >= 500 ? 'Internal server error' : message,
    ...(errors ? { errors } : {}),
  });
}

/**
 * 404 handler — catches unmatched routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
}
