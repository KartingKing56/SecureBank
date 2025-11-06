import { Request, Response, NextFunction } from 'express';

export function httpsOnly() {
  return function (req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV !== 'production') return next();

    const proto = (req.headers['x-forwarded-proto'] as string) || (req as any).protocol;
    if (proto === 'https') return next();

    const host = req.headers.host;
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  };
}
