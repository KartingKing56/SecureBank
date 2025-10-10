import bcrypt from 'bcryptjs';
import { ENV } from '../config/env';

const ROUNDS = 12;

//--------------------------------------
// Verifies password has a digit, special char and a capital.
//--------------------------------------
  export type PasswordPolicyReport = {
    length: boolean;
    upper: boolean;
    lower: boolean;
    digit: boolean;
    special: boolean;
    ok: boolean;
  };

  export function passwordPolicyReport(pw: string): PasswordPolicyReport {
    return {
      length: pw.length >= 12,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      digit: /\d/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
      get ok() {
        return this.length && this.upper && this.lower && this.digit && this.special;
      }
    };
  }

//--------------------------------------
// Salting and hashing of passwords
//--------------------------------------
export async function hashPassword(plain: string) {
  const salted = plain + ENV.PASSWORD_PEPPER;
  const salt = await bcrypt.genSalt(ROUNDS);
  return bcrypt.hash(salted, salt);
}

export async function verifyPassword(plain: string, hashed: string) {
  return bcrypt.compare(plain + ENV.PASSWORD_PEPPER, hashed);
}