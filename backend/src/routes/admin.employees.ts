import { Router, Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { requireAuth, requireRole } from "../middlewares/authJwt";
import { REGEX } from "../utils/regex";
import { generateAccountNumber } from "../utils/accountNumber";
import { hashPassword } from "../utils/password";

// --------------------------------------
// Validation
// --------------------------------------
const CreateEmployeeSchema = z.object({
  firstName: z.string().regex(REGEX.firstName),
  surname: z.string().regex(REGEX.surname),
  idNumber: z.string().regex(REGEX.idNumber),
  username: z.string().regex(REGEX.username),
  email: z.string().email().max(254),
  password: z.string().regex(REGEX.password),
  staffId: z.string().regex(/^[A-Z0-9-]{3,32}$/),
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

adminEmployees.post("/", async (req: Request, res: Response) => {
  const parse = CreateEmployeeSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "validation_error", details: parse.error.flatten() });
  }

  const { firstName, surname, idNumber, username, email, password, staffId, department } = parse.data;

  const existing = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { idNumber }, { "employee.staffId": staffId }],
  }).select("_id username idNumber employee.staffId");
  if (existing) {
    return res.status(409).json({ error: "conflict", message: "username / idNumber / staffId already exists" });
  }

  const accountNumber = generateAccountNumber();
  const passwordHash = hashPassword(password);

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
    email,
    username: employee.username,
    staffId,
    accountNumber: employee.accountNumber,
    role: "employee",
  });
});

adminEmployees.get("/", async (_req: Request, res: Response) => {
  const rows = await User.find({ role: "employee" })
    .select("firstName surname username accountNumber employee.staffId employee.department employee.active createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return res.json(rows);
});

adminEmployees.patch("/:id/active", async (req: Request, res: Response) => {
  const parse = ToggleActiveSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "validation_error", details: parse.error.flatten() });
    }
  const { active } = parse.data;

  const doc = await User.findOneAndUpdate(
    { _id: req.params.id, role: "employee" },
    { $set: { "employee.active": active } },
    { new: true }
  ).select("username employee.staffId employee.active");

  if (!doc) return res.status(404).json({ error: "not_found" });

  return res.json({ id: doc._id, staffId: doc.employee?.staffId, active: doc.employee?.active });
});

adminEmployees.patch("/:id/password", async (req: Request, res: Response) => {
  const parse = ResetPasswordSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "validation_error", details: parse.error.flatten() });
  }
  const { password } = parse.data;
  const passwordHash = await hashPassword(password);

  const doc = await User.findOneAndUpdate(
    { _id: req.params.id, role: "employee" },
    { $set: { passwordHash } },
    { new: false }
  ).select("_id");

  if (!doc) return res.status(404).json({ error: "not_found" });

  return res.json({ ok: true });
});
