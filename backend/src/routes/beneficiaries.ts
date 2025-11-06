import { Router } from "express";
import { requireAuth, getAuthUserId } from "../middlewares/authJwt";
import { authLimiter } from "../middlewares/rateLimit";
import { validate } from "../middlewares/validate";
import { verifyDoubleSubmit } from "../utils/csrf";
import { verifyCsrf } from "../middlewares/csrf";
import {
  CreateBeneficiarySchema,
  ListBeneficiariesSchema,
} from "../schemas/beneficiary.schema";
import { Beneficiary } from "../models/Beneficiary";

export const beneficiaries = Router();

beneficiaries.post(
  "/beneficiaries",
  requireAuth,
  authLimiter,
  verifyCsrf,
  validate(CreateBeneficiarySchema),
  async (req, res, next) => {
    try {
      if (!verifyDoubleSubmit(req)) {
        return res.status(403).json({ error: "CSRF" });
      }

      const userId = getAuthUserId(req);

      const b = await Beneficiary.create({ userId, ...req.body });

      res.status(201).json({
        id: b._id,
        type: b.type,
        name: b.name,
        bankName: b.bankName,
        branchCode: b.branchCode,
        accountNumber: b.accountNumber,
        ibanOrAccount: b.ibanOrAccount,
        swiftBic: b.swiftBic,
        country: b.country,
        email: b.email,
        reference: b.reference,
        createdAt: b.createdAt,
      });
    } catch (e: any) {
      if (e?.code === 11000) {
        return res.status(409).json({ error: "Duplicate beneficiary" });
      }
      next(e);
    }
  }
);

beneficiaries.get(
  "/beneficiaries",
  requireAuth,
  validate(ListBeneficiariesSchema),
  async (req, res, next) => {
    try {
      const userId = getAuthUserId(req);

      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)));

      const filter: Record<string, unknown> = { userId };
      if (req.query.type) filter.type = req.query.type;

      const [items, total] = await Promise.all([
        Beneficiary.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
          .exec(),
        Beneficiary.countDocuments(filter),
      ]);

      res.json({ page, limit, total, items });
    } catch (e) {
      next(e);
    }
  }
);
