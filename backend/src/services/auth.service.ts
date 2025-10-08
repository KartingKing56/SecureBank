import { hashPassword, verifyPassword, passwordMeetsPolicy } from '../utils/password';

export async function createUserSecure(password: string) {
  if (!passwordMeetsPolicy(password)) {
    const e: any = new Error('WeakPassword');
    e.status = 400;
    throw e;
  }
  const hashed = await hashPassword(password);
  // TODO: insert into your Users collection with hashed password
  return { id: 'placeholder', passwordHash: hashed };
}

export async function verifyUserPassword(_userId: string, password: string, expectedHash: string) {
  return verifyPassword(password, expectedHash);
}
