import { Router } from 'express';
import { z } from 'zod';
import { authLimiter } from '../middlewares/rateLimit';
import { validate } from '../middlewares/validate';
import { issueCsrfCookie, verifyDoubleSubmit } from '../utils/csrf';
import { createUserSecure } from '../services/auth.service';
import { signAccessJwt, signRefreshJwt } from '../services/token.service';
import { REGEX } from '../utils/regex';
import { User } from '../models/User';
import { verifyPassword as verifyPw } from '../utils/password';

export const auth = Router();

const RegisterSchema = z.object({
  body: z.object({
    firstName: z.string().regex(REGEX.firstName, 'Invalid first name'),
    surname: z.string().regex(REGEX.surname, 'Invalid surname'),
    idNumber: z.string().regex(REGEX.idNumber, 'Invalid ID number'),
    username: z.string().regex(REGEX.username, 'Invalid username'),
    password: z.string().regex(
      REGEX.password,
      'Password must be 12+ chars and include upper, lower, number and special character'
    ),
    confirmPassword: z.string(),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: 'Passwords do not match',
      });
    }
  }),
});

const LoginSchema = z.object({
  body: z.object({
    username: z.string().regex(REGEX.username, 'Invalid username'),
    accountNumber: z.string().regex(/^\d{10}$/, 'Invalid account number'),
    password: z.string().min(1, 'Password required'),
  }),
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

auth.post('/auth/login', authLimiter, validate(LoginSchema), async (req, res, next) => {
  try {
    if (!verifyDoubleSubmit(req)) {
      return res.status(403).json({ error: 'CSRF' });
    }

    const username = req.body.username.trim().toLowerCase();
    const accountNumber = req.body.accountNumber.trim();
    const password = req.body.password;

    const user = await User.findOne({ username, accountNumber }).select('+passwordHash');

    if (!user || !user.passwordHash){
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await verifyPw(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const uid = user._id.toString();
    const accessToken = await signAccessJwt(uid);
    const refreshToken = await signRefreshJwt(uid);

    res
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ accessToken });
  } catch (err) {
    next(err);
  }
});
