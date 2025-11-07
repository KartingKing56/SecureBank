import { Router, Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { validate } from "../middlewares/validate";
import { requireAuth, getAuthUserId } from "../middlewares/authJwt";
import { CreateTxSchema, ListTxSchema } from "../schemas/tx.schema";
import { Transaction } from "../models/Transaction";
import { verifyDoubleSubmit } from "../utils/csrf";
import { authLimiter } from "../middlewares/rateLimit";
import { verifyCsrf } from "../middlewares/csrf";
import { TX_REGEX } from "../utils/regex.tx";

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
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log("=== VALIDATION DEBUG ===");
      console.log("Received data:", JSON.stringify(req.body, null, 2));
      console.log("Amount:", req.body.amount, "matches:", TX_REGEX.amount.test(req.body.amount));
      console.log("SWIFT:", req.body.swiftBic, "matches:", TX_REGEX.swiftBic.test(req.body.swiftBic));
      console.log("IBAN:", req.body.beneficiary?.ibanOrAccount, "matches:", TX_REGEX.ibanOrAccount.test(req.body.beneficiary?.ibanOrAccount));
      console.log("Name:", req.body.beneficiary?.name, "matches:", TX_REGEX.name.test(req.body.beneficiary?.name));
      console.log("Currency:", req.body.currency, "matches:", TX_REGEX.currency.test(req.body.currency));
      console.log("========================");

      if (!verifyDoubleSubmit(req)) return res.status(403).json({ error: "CSRF" });

      const userId = getAuthUserId(req);
      const reference = makeReference();

      if (!req.body.amount || isNaN(parseFloat(req.body.amount)) || parseFloat(req.body.amount) <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const amountDecimal = mongoose.Types.Decimal128.fromString(req.body.amount);

      const swiftBic = String(req.body.swiftBic || "").toUpperCase();
      if (!swiftBic || swiftBic.length < 8) {
        return res.status(400).json({ error: "Valid SWIFT/BIC code required (8-11 characters)" });
      }

      const beneficiary = {
        name: req.body.beneficiary.name,
        bankName: req.body.beneficiary.bankName,
        ibanOrAccount: String(req.body.beneficiary.ibanOrAccount).toUpperCase(),
      };

      if (!beneficiary.name?.trim()) {
        return res.status(400).json({ error: "Beneficiary name required" });
      }
      if (!beneficiary.ibanOrAccount?.trim()) {
        return res.status(400).json({ error: "Beneficiary account required" });
      }

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

      res.status(201).json({ 
        id: tx._id, 
        reference: tx.reference, 
        status: tx.status 
      });
    } catch (e) {
      console.error("Transaction creation error:", e);
      next(e);
    }
  }
);

transactions.get(
  "/tx",
  requireAuth,
  validate(ListTxSchema),
  async (req: Request, res: Response, next: NextFunction) => {
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

transactions.get("/tx/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getAuthUserId(req);
    const tx = await Transaction.findOne({ _id: req.params.id, userId }).lean().exec();
    if (!tx) return res.status(404).json({ error: "Not found" });
    res.json(tx);
  } catch (e) {
    next(e);
  }
});