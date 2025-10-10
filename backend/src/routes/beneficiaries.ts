import { Router } from 'express';
import { requireAuth } from '../middlewares/authJwt';
import { validate } from '../middlewares/validate';
import { CreateBeneficiarySchema } from '../schemas/beneficiary.schema';
import { Beneficiary } from '../models/Beneficiary';
import { verifyDoubleSubmit } from '../utils/csrf';
import { authLimiter } from '../middlewares/rateLimit';

export const beneficiaries = Router();

beneficiaries.post('/beneficiaries',
  requireAuth,
  authLimiter,
  validate(CreateBeneficiarySchema),
  async (req, res, next) => {
    try {
      if (!verifyDoubleSubmit(req)) return res.status(403).json({ error: 'CSRF' });
      const userId = (req as any).userId;
      const payload = req.body;

      if (payload.type === 'foreign') {
        payload.country = payload.country.toUpperCase();
        payload.swiftBic = payload.swiftBic.toUpperCase();
        payload.ibanOrAccount = payload.ibanOrAccount.toUpperCase();
      }

      const b = await Beneficiary.create({ ...payload, userId });
      res.status(201).json({ id: b._id });
    } catch (e) { next(e); }
  }
);

beneficiaries.get('/beneficiaries', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const items = await Beneficiary.find({ userId }).sort({ createdAt: -1 }).limit(200);
    res.json({ items });
  } catch (e) { next(e); }
});
