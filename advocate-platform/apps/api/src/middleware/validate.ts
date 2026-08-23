import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Validates req[target] against a Zod schema.
 * Returns 422 with field-level errors if validation fails.
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req[target]);

      if (!result.success) {
        const errors = result.error.flatten();
        const messages = Object.entries(errors.fieldErrors)
          .map(([field, msgs]) => `${field}: ${(msgs ?? []).join(', ')}`)
          .concat(errors.formErrors);

        return next(new AppError(`Validation failed: ${messages.join('; ')}`, 422, messages));
      }

      // Replace with parsed (and potentially transformed) data
      req[target] = result.data;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new AppError('Validation error', 422));
      }
      next(err);
    }
  };
}
