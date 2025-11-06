import { Request, Response, NextFunction } from 'express';
import { verifyAccessJwt } from '../services/token.service';
import { User } from '../models/User';

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId: string;
      role?: "customer" | "employee" | "admin";
    };
  }
}

//--------------------------------------
// Json token authorisation
//--------------------------------------
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = await verifyAccessJwt(token) as { sub: string; role?: "customer" | "employee" | "admin" };

    let role = payload.role;
    if (!role) {
      const user = await User.findById(payload.sub).select<{ role: "customer" | "employee" | "admin"; }>("role").lean();
      role = user?.role;
    }

    const authObj: { userId: string; role?: "customer" | "employee" | "admin" } = { userId: payload.sub };
    if (role) authObj.role = role;

    req.auth = authObj;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...roles: Array<"admin" | "employee" | "customer">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.auth?.role;
    if (!userRole) return res.status(403).json({ errpr: "forbidden" });
    if (!roles.includes(userRole)) return res.status(403).json({ error: "forbidden" });
    return next();
  };
}

export function getAuthUserId(req: Request): string {
  const uid = req.auth?.userId;
  if (!uid) throw Object.assign(new Error("unothorized"), { status: 401 });
  return uid;
}