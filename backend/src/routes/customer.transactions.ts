import { Router } from "express";
import { z } from "zod";
import { requireAuth, getAuthUserId } from "../middlewares/authJwt";
import { Transaction } from "../models/Transaction";

export const customerTransactions = Router();

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(["pending", "verified", "queued", "forwarded", "failed"]).optional(),
});

customerTransactions.get("/", requireAuth, async (req, res) => {
  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
  }
  const { page, limit, status } = parsed.data;

  const userId = getAuthUserId(req);

  const filter: any = { userId };
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec(),
    Transaction.countDocuments(filter),
  ]);

  res.json({ page, limit, total, items });
});
