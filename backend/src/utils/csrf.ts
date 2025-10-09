import { randomBytes } from 'crypto';
import type { Response, Request } from 'express';
import { ENV } from '../config/env';

export function issueCsrfCookie(res: Response) {
  const token = randomBytes(32).toString('base64url');

  res.cookie(ENV.CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 1000,
  });
  return token;
}

export function verifyDoubleSubmit(req: Request) {
  const cookie = req.cookies?.[ENV.CSRF_COOKIE_NAME];
  const header = req.header('X-CSRF-Token');
  return cookie && header && cookie === header;
}