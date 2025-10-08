import { SignJWT, jwtVerify } from 'jose';
import { ENV } from '../config/env';

function getKey() {
  return new TextEncoder().encode(ENV.JWT.SECRET);
}

export async function signAccessJwt(sub: string, extra?: Record<string, unknown>) {
  return await new SignJWT({ ...extra })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setIssuer(ENV.JWT.ISS)
    .setAudience(ENV.JWT.AUD)
    .setExpirationTime(ENV.JWT.ACCESS_TTL)
    .sign(getKey());
}

export async function signRefreshJwt(sub: string, extra?: Record<string, unknown>) {
  return await new SignJWT({ type: 'refresh', ...extra })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setIssuer(ENV.JWT.ISS)
    .setAudience(ENV.JWT.AUD)
    .setExpirationTime(ENV.JWT.REFRESH_TTL)
    .sign(getKey());
}

export async function verifyJwt<T = unknown>(token: string) {
  const { payload } = await jwtVerify(token, getKey(), {
    issuer: ENV.JWT.ISS,
    audience: ENV.JWT.AUD
  });
  return payload as T & { sub: string };
}
