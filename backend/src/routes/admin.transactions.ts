import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/authJwt";
import { z } from "zod";
import { Transaction } from "../models/Transaction";

export const adminTransactions = Router();

adminTransactions.use(requireAuth, requireRole("admin"));

const QuerySchema = z.object({
  status: z.enum(["queued", "forwarded", "failed"]).default("queued"),
  limit: z.coerce.number().min(1).max(500).default(200),
  cursor: z.string().optional(),
});

adminTransactions.get("/", async (req, res) => {
  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
  const { status, limit, cursor } = parsed.data;

  const find: any = { provider: "SWIFT", status };
  if (cursor) {
    const d = new Date(cursor);
    if (!Number.isNaN(d.getTime())) find.createdAt = { $lt: d };
  }

  const rows = await Transaction.find(find)
  .sort({ createdAt: -1 })
  .limit(limit)
  .lean()
  .exec();
  const nextCursor =
  rows && rows.length > 0 && rows[rows.length - 1]?.createdAt
    ? new Date(rows[rows.length - 1]!.createdAt!).toISOString()
    : null;

  res.json({ items: rows, nextCursor });
});
