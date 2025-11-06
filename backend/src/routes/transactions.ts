import { Router } from "express";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { validate } from "../middlewares/validate";
import { requireAuth, getAuthUserId } from "../middlewares/authJwt";
import { CreateTxSchema, ListTxSchema } from "../schemas/tx.schema";
import { Transaction } from "../models/Transaction";
import { verifyDoubleSubmit } from "../utils/csrf";
import { authLimiter } from "../middlewares/rateLimit";
import { verifyCsrf } from "../middlewares/csrf";

export const transactions = Router();

function makeReference() {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `SBK-${ymd}-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

transactions.post(
  "/tx",
  requireAuth,
  authLimiter,
  verifyCsrf,
  validate(CreateTxSchema),
  async (req, res, next) => {
    try {
      if (!verifyDoubleSubmit(req)) return res.status(403).json({ error: "CSRF" });

      const userId = getAuthUserId(req);
      const reference = makeReference();

      const amountDecimal = mongoose.Types.Decimal128.fromString(req.body.amount);

      const swiftBic = String(req.body.swiftBic ?? req.body.beneficiary?.swiftBic ?? "").toUpperCase();
      if (!swiftBic) {
        return res.status(400).json({ error: "swiftBic_required" });
      }

      const beneficiary = {
        name: req.body.beneficiary.name,
        bankName: req.body.beneficiary.bankName,
        ibanOrAccount: String(req.body.beneficiary.ibanOrAccount).toUpperCase(),
      };

      const tx = await Transaction.create({
        userId,
        reference,
        amount: amountDecimal,
        currency: String(req.body.currency).toUpperCase(),
        provider: "SWIFT",
        swiftBic,
        beneficiary,
        note: req.body.note,
        status: "pending",
      });

      res.status(201).json({ id: tx._id, reference: tx.reference, status: tx.status });
    } catch (e) {
      next(e);
    }
  }
);

transactions.get(
  "/tx",
  requireAuth,
  validate(ListTxSchema),
  async (req, res, next) => {
    try {
      const userId = getAuthUserId(req);

      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)));

      const filter: Record<string, unknown> = { userId };
      if (req.query.status) filter.status = req.query.status;

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
    } catch (e) {
      next(e);
    }
  }
);

transactions.get("/tx/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    const tx = await Transaction.findOne({ _id: req.params.id, userId }).lean().exec();
    if (!tx) return res.status(404).json({ error: "Not found" });
    res.json(tx);
  } catch (e) {
    next(e);
  }
});
