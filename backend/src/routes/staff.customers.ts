import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/authJwt";
import { User } from "../models/User";

export const staffCustomers = Router();

staffCustomers.use(requireAuth, requireRole("employee", "admin"));

staffCustomers.get("/customers", async (req, res) => {
  const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 100));
  const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;

  const find: any = { role: "customer" };
  if (cursor) {
    const d = new Date(cursor);
    if (!Number.isNaN(d.getTime())) find.createdAt = { $lt: d };
  }

  const rows = await User.find(find)
    .select("firstName surname username accountNumber createdAt")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();

  const last = rows[rows.length - 1];
  const nextCursor = last?.createdAt ? new Date(last.createdAt).toISOString() : null;

  res.json({ items: rows, nextCursor });
});
