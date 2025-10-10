import { ZodType, ZodError } from 'zod';
import { RequestHandler } from 'express';

export function validate(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as any;

      req.body = parsed.body;
      if (parsed.params) Object.assign(req.params, parsed.params);
      if (parsed.query)  (req as any).validatedQuery = parsed.query;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: 'ValidationError', issues: err.issues });
      }
      next(err);
    }
  };
}
