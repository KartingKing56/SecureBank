import { Router } from 'express';
import { z } from 'zod';
import { authLimiter } from '../middlewares/rateLimit';
import { validate } from '../middlewares/validate';
import { issueCsrfCookie, verifyDoubleSubmit } from '../utils/csrf';
import { createUserSecure } from '../services/auth.service';
import { signAccessJwt, signRefreshJwt } from '../services/token.service';

export const auth = Router();

const RegisterSchema = z.object({
  body: z.object({
    password: z.string().min(12)
  })
});

auth.post('/auth/csrf', (req, res) => {
  const token = issueCsrfCookie(res);
  res.json({ csrf: token });
});

auth.post('/auth/register', authLimiter, validate(RegisterSchema), async (req, res, next) => {
  try {
    if (!verifyDoubleSubmit(req)) return res.status(403).json({ error: 'CSRF' });
    const { password } = req.body;
    const user = await createUserSecure(password);
    const access = await signAccessJwt(user.id);
    const refresh = await signRefreshJwt(user.id);
    res.status(201).json({ userId: user.id, access, refresh });
  } catch (e) { next(e); }
});