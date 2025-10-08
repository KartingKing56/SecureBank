import type { ZodType } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      }));

      return res.status(400).json({
        error: 'ValidationError',
        issues,
        message: 'Request validation failed',
      });
    }

    next();
  };
