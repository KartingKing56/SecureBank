import { Request, Response, NextFunction } from 'express';
import { verifyAccessJwt } from '../services/token.service';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = await verifyAccessJwt(token);
    (req as any).userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}