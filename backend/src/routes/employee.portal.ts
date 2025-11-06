import { Router, Request, Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { requireAuth, requireRole, getAuthUserId } from "../middlewares/authJwt";
import { Transaction } from "../models/Transaction";
import { TX_REGEX } from "../utils/regex.tx";
import { verifyCsrf } from "../middlewares/csrf";

export const employeePortal = Router();

employeePortal.use(requireAuth, requireRole("employee", "admin"));

type TxLean = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  reference: string;
  amount: mongoose.Types.Decimal128 | string;
  currency: string;
  provider: "SWIFT";
  swiftBic: string;
  beneficiary: {
    name: string;
    bankName?: string;
    ibanOrAccount: string;
  };
  note?: string;
  status: "pending" | "verified" | "queued" | "forwarded" | "failed";
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  submittedBy?: mongoose.Types.ObjectId;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

// --------------------------------------
// Validators
// --------------------------------------
const ObjectIdSchema = z
  .string()
  .refine((v) => mongoose.isValidObjectId(v), "invalid_id");

const QueueQuerySchema = z.object({
  status: z.enum(["pending", "verified"]).default("pending"),
  limit: z.coerce.number().min(1).max(500).default(200),
  cursor: z.string().optional(), // ISO date string
});

const VerifyBodySchema = z.object({
  swiftBic: z
    .string()
    .regex((TX_REGEX as any).swiftBic ?? /^[A-Z0-9]{8}([A-Z0-9]{3})?$/)
    .optional(),
});

const BulkSubmitBody = z.object({
  ids: z.array(ObjectIdSchema).min(1).max(500),
});

employeePortal.get("/queue", async (req: Request, res: Response) => {
  const parsed = QueueQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "validation_error", details: parsed.error.flatten() });
  }

  const { status, limit, cursor } = parsed.data;

  const find: Record<string, unknown> = { provider: "SWIFT", status };
  if (cursor) {
    const d = new Date(cursor);
    if (!Number.isNaN(d.getTime())) (find as any).createdAt = { $lt: d };
  }

  const rows = (await Transaction.find(find)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec()) as unknown as TxLean[];

  const last: TxLean | undefined = rows.length > 0 ? rows[rows.length - 1] : undefined;
  const nextCursor = last ? new Date(last.createdAt).toISOString() : null;

  return res.json({ items: rows, nextCursor });
});

employeePortal.get("/:id", async (req: Request, res: Response) => {
  const idRes = ObjectIdSchema.safeParse(req.params.id);
  if (!idRes.success) return res.status(400).json({ error: "invalid_id" });

  const found = (await Transaction.findOne({
    _id: idRes.data,
    provider: "SWIFT",
  })
    .lean()
    .exec()) as unknown as TxLean | null;

  if (!found) return res.status(404).json({ error: "not_found" });
  const tx: TxLean = found;
  return res.json(tx);
});

employeePortal.post(
  "/:id/verify",
  verifyCsrf,
  async (req: Request, res: Response) => {
    const idRes = ObjectIdSchema.safeParse(req.params.id);
    if (!idRes.success) return res.status(400).json({ error: "invalid_id" });

    const parsedBody = VerifyBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res
        .status(400)
        .json({ error: "validation_error", details: parsedBody.error.flatten() });
    }
    const { swiftBic } = parsedBody.data;

    const employeeId = getAuthUserId(req);

    const update: Record<string, unknown> = {
      status: "verified",
      verifiedBy: new mongoose.Types.ObjectId(employeeId),
      verifiedAt: new Date(),
    };
    if (swiftBic) (update as any).swiftBic = swiftBic.toUpperCase();

    const updated = (await Transaction.findOneAndUpdate(
      { _id: idRes.data, provider: "SWIFT", status: "pending" },
      { $set: update },
      { new: true }
    )
      .lean()
      .exec()) as unknown as TxLean | null;

    if (!updated) {
      return res.status(409).json({ error: "not_found_or_wrong_state" });
    }

    const doc: TxLean = updated;
    return res.json(doc);
  }
);

employeePortal.post(
  "/:id/submit",
  verifyCsrf,
  async (req: Request, res: Response) => {
    const idRes = ObjectIdSchema.safeParse(req.params.id);
    if (!idRes.success) return res.status(400).json({ error: "invalid_id" });

    const employeeId = getAuthUserId(req);

    const updated = (await Transaction.findOneAndUpdate(
      { _id: idRes.data, provider: "SWIFT", status: "verified" },
      {
        $set: {
          status: "queued",
          submittedBy: new mongoose.Types.ObjectId(employeeId),
          submittedAt: new Date(),
        },
      },
      { new: true }
    )
      .lean()
      .exec()) as unknown as TxLean | null;

    if (!updated) return res.status(409).json({ error: "not_verified" });

    const doc: TxLean = updated;
    return res.json({ ok: true, id: doc._id, status: doc.status });
  }
);

employeePortal.post(
  "/submit-bulk",
  verifyCsrf,
  async (req: Request, res: Response) => {
    const parse = BulkSubmitBody.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "validation_error", details: parse.error.flatten() });
    }

    const employeeId = new mongoose.Types.ObjectId(getAuthUserId(req));
    const ids = parse.data.ids.map((i) => new mongoose.Types.ObjectId(i));

    const result = await Transaction.updateMany(
      { _id: { $in: ids }, provider: "SWIFT", status: "verified" },
      {
        $set: {
          status: "queued",
          submittedBy: employeeId,
          submittedAt: new Date(),
        },
      }
    ).exec();

    return res.json({
      ok: true,
      matched: (result as any).matchedCount ?? 0,
      modified: (result as any).modifiedCount ?? 0,
    });
  }
);
