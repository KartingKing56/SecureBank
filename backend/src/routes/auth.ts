import { Router } from 'express';
import { z } from 'zod';
import { authLimiter } from '../middlewares/rateLimit';
import { validate } from '../middlewares/validate';
import { issueCsrfCookie, verifyDoubleSubmit } from '../utils/csrf';
import { createUserSecure } from '../services/auth.service';
import { signAccessJwt, signRefreshJwt } from '../services/token.service';
import { PASSWORD_POLICY_REGEX } from '../utils/password';

export const auth = Router();

const RegisterSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    surname: z.string().min(1),
    idNumber: z.string().length(13),
    username: z.string().min(4),
    password: z.string().min(12),
    confirmPassword: z.string(),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: 'Passwords do not match'
      });
    }

    if (!PASSWORD_POLICY_REGEX.test(data.password)) {
      ctx.addIssue({
        path: ['password'],
        code: 'custom',
        message: 'Password must be 12+ chars and include upper, lower, number and special character'
      });
    }
  })
});

auth.post('/auth/csrf', (req, res) => {
  const token = issueCsrfCookie(res);
  res.json({ csrf: token });
});

auth.post('/auth/register', authLimiter, validate(RegisterSchema), async (req, res, next) => {
  try {
    if (!verifyDoubleSubmit(req)) {
      return res.status(403).json({ error: 'CSRF' });
    }

    const { firstName, surname, idNumber, username, password } = req.body;

    const user = await createUserSecure({ firstName, surname, idNumber, username, password });

    res.status(201).json({ userId: user._id, accountNumber: user.accountNumber });
  } catch (e) {
    next(e);
  }
});