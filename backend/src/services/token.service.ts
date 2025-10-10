import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { ENV } from '../config/env';

let cachedKey: Uint8Array | null = null;
function getKey() {
  if (!cachedKey) cachedKey = new TextEncoder().encode(ENV.JWT.SECRET);
  return cachedKey;
}

//--------------------------------------
// Signs json access token
//--------------------------------------
export async function signAccessJwt(sub: string, extra?: Record<string, unknown>) {
  return await new SignJWT({ ...extra })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setIssuer(ENV.JWT.ISS)
    .setAudience(ENV.JWT.AUD)
    .setExpirationTime(ENV.JWT.ACCESS_TTL)
    .sign(getKey());
}

//--------------------------------------
// Refreshes json access token
//--------------------------------------
export async function signRefreshJwt(sub: string, extra?: Record<string, unknown>) {
  return await new SignJWT({ type: 'refresh', ...extra })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setIssuer(ENV.JWT.ISS)
    .setAudience(ENV.JWT.AUD)
    .setExpirationTime(ENV.JWT.REFRESH_TTL)
    .sign(getKey());
}

export type VerifiedPayload = JWTPayload & { sub: string};

//--------------------------------------
// Verifies access token
//--------------------------------------
export async function verifyJwt<T = JWTPayload>(token: string) {
  const { payload } = await jwtVerify(token, getKey(), {
    issuer: ENV.JWT.ISS,
    audience: ENV.JWT.AUD,
  });
  return payload as T & { sub: string };
}

export async function verifyAccessJwt(token: string) {
  return verifyJwt(token);
}
