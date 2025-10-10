import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/authJwt';
import { CreateTxSchema, ListTxSchema } from '../schemas/tx.schema';
import { Transaction } from '../models/Transaction';
import { verifyDoubleSubmit } from '../utils/csrf';
import { authLimiter } from '../middlewares/rateLimit';
import { randomUUID } from 'crypto';

export const transactions = Router();

function makeReference() {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
  return `SBK-${ymd}-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

transactions.post(
  '/tx',
  requireAuth,
  authLimiter,
  validate(CreateTxSchema),
  async (req, res, next) => {
    try {
      if (!verifyDoubleSubmit(req)) return res.status(403).json({ error: 'CSRF' });

      const userId = (req as any).userId;
      const reference = makeReference();

      const tx = await Transaction.create({
        userId,
        reference,
        amount: req.body.amount,
        currency: req.body.currency,
        provider: 'SWIFT',
        beneficiary: {
          name: req.body.beneficiary.name,
          bankName: req.body.beneficiary.bankName,
          ibanOrAccount: req.body.beneficiary.ibanOrAccount,
        },
        note: req.body.note,
        status: 'pending',
      });

      res.status(201).json({ id: tx._id, reference: tx.reference, status: tx.status });
    } catch (e) { next(e); }
  }
);

transactions.get(
  '/tx',
  requireAuth,
  validate(ListTxSchema),
  async (req, res, next) => {
    try {
      const userId = (req as any).userId;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const filter: any = { userId };
      if (req.query.status) filter.status = req.query.status;

      const [items, total] = await Promise.all([
        Transaction.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        Transaction.countDocuments(filter),
      ]);

      res.json({ page, limit, total, items });
    } catch (e) { next(e); }
  }
);

transactions.get(
  '/tx/:id',
  requireAuth,
  async (req, res, next) => {
    try {
      const userId = (req as any).userId;
      const tx = await Transaction.findOne({ _id: req.params.id, userId });
      if (!tx) return res.status(404).json({ error: 'Not found' });
      res.json(tx);
    } catch (e) { next(e); }
  }
);
