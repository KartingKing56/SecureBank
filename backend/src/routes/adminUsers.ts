import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middlewares/authJwt";
import { User } from "../models/User";

export const adminUsers = Router();
adminUsers.use(requireAuth, requireRole("admin"));

const Query = z.object({
  role: z.enum(["customer", "employee"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

adminUsers.get("/", async (req, res) => {
  const parsed = Query.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
  }

  const { role, page, limit } = parsed.data;
  const filter: Record<string, any> = {};
  if (role) filter.role = role;

  const [items, total] = await Promise.all([
    User.find(filter)
      .select("firstName surname username accountNumber role employee.staffId employee.department employee.active createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec(),
    User.countDocuments(filter),
  ]);

  res.json({ page, limit, total, items });
});
