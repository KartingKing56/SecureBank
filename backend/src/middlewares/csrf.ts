import type { Request, Response, NextFunction } from "express";
import { verifyDoubleSubmit } from "../utils/csrf";

export function verifyCsrf(req: Request, res: Response, next: NextFunction) {
  if (!verifyDoubleSubmit(req)) {
    return res.status(403).json({ error: "invalid_csrf" });
  }
  return next();
}