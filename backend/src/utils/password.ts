import bcrypt from 'bcryptjs';
import { ENV } from '../config/env';

const ROUNDS = 12;

export async function hashPassword(plain: string) {
  const salted = plain + ENV.PASSWORD_PEPPER;
  const salt = await bcrypt.genSalt(ROUNDS);
  return bcrypt.hash(salted, salt);
}

export async function verifyPassword(plain: string, hashed: string) {
  return bcrypt.compare(plain + ENV.PASSWORD_PEPPER, hashed);
}

export function passwordMeetsPolicy(pw: string) {
  return pw.length >= 12 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw);
}