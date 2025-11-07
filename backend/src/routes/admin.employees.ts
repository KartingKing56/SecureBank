import { Router, Request, Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { User } from "../models/User";
import { requireAuth, requireRole } from "../middlewares/authJwt";
import { REGEX } from "../utils/regex";
import { generateAccountNumber } from "../utils/accountNumber";
import { hashPassword } from "../utils/password";
import { verifyCsrf } from "../middlewares/csrf";

// --------------------------------------
// Validation 
// --------------------------------------
const CreateEmployeeSchema = z.object({
  firstName: z.string().regex(REGEX.firstName),
  surname: z.string().regex(REGEX.surname),
  idNumber: z.string().regex(REGEX.idNumber),
  username: z.string().regex(REGEX.username),
  email: z.string().email().max(254).optional(),
  password: z.string().regex(REGEX.password),
  staffId: z.string().regex(/^[A-Z0-9-]{3,32}$/).optional(),
  department: z.string().regex(/^[A-Za-z0-9 .-]{2,40}$/).optional(),
});

const ResetPasswordSchema = z.object({
  password: z.string().regex(REGEX.password),
});

const ToggleActiveSchema = z.object({
  active: z.boolean(),
});

// --------------------------------------
// Router
// --------------------------------------
export const adminEmployees = Router();

adminEmployees.use(requireAuth, requireRole("admin"));

adminEmployees.post("/", verifyCsrf, async (req: Request, res: Response) => {
  const parsed = CreateEmployeeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
  }

  const { firstName, surname, idNumber, username, email, password, staffId, department } = parsed.data;

  const or: any[] = [{ username: username.toLowerCase() }, { idNumber }];
  if (staffId) or.push({ "employee.staffId": staffId });
  const existing = await User.findOne({ $or: or }).select("_id username idNumber employee.staffId").lean();
  if (existing) {
    return res.status(409).json({ error: "conflict", message: "username / idNumber / staffId already exists" });
  }

  const accountNumber = generateAccountNumber();
  const passwordHash = await hashPassword(password);

  try {
    const employee = await User.create({
      firstName,
      surname,
      idNumber,
      username: username.toLowerCase(),
      accountNumber,
      passwordHash,
      role: "employee",
      employee: {
        staffId,
        department,
        active: true,
      },
    });

    return res.status(201).json({
      id: employee._id,
      username: employee.username,
      accountNumber: employee.accountNumber,
      role: "employee",
      staffId: employee.employee?.staffId,
      department: employee.employee?.department,
      email: email ?? undefined,
      createdAt: employee.createdAt,
    });
  } catch (e: any) {
    if (e?.code === 11000) {
      return res.status(409).json({ error: "conflict", message: "duplicate key", key: e?.keyValue });
    }
    throw e;
  }
});

adminEmployees.get("/", async (_req: Request, res: Response) => {
  const rows = await User.find({ role: "employee" })
    .select("firstName surname username accountNumber employee.staffId employee.department employee.active createdAt")
    .sort({ createdAt: -1 })
    .lean();
  return res.json(rows);
});

adminEmployees.patch("/:id/active", verifyCsrf, async (req: Request, res: Response) => {
  const validId = mongoose.isValidObjectId(req.params.id);
  if (!validId) return res.status(400).json({ error: "invalid_id" });

  const parsed = ToggleActiveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
  }
  const { active } = parsed.data;

  const doc = await User.findOneAndUpdate(
    { _id: req.params.id, role: "employee" },
    { $set: { "employee.active": active } },
    { new: true }
  ).select("username employee.staffId employee.active");

  if (!doc) return res.status(404).json({ error: "not_found" });

  return res.json({ id: doc._id, staffId: doc.employee?.staffId, active: doc.employee?.active });
});

adminEmployees.patch("/:id/password", verifyCsrf, async (req: Request, res: Response) => {
  const validId = mongoose.isValidObjectId(req.params.id);
  if (!validId) return res.status(400).json({ error: "invalid_id" });

  const parsed = ResetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
  }
  const { password } = parsed.data;
  const passwordHash = await hashPassword(password);

  const doc = await User.findOneAndUpdate(
    { _id: req.params.id, role: "employee" },
    { $set: { passwordHash } },
    { new: false }
  ).select("_id");

  if (!doc) return res.status(404).json({ error: "not_found" });

  return res.json({ ok: true });
});
