import { hashPassword, verifyPassword as verifyPasswordHash } from '../utils/password';
import { User } from '../models/User';
import { generateAccountNumber } from '../utils/accountNumber';


export async function createUserSecure(data: {
  firstName: string;
  surname: string;
  idNumber: string;
  username: string;
  password: string;
}) {
  const { firstName, surname, idNumber, username, password } = data;

  const passwordHash = await hashPassword(password);

  let accountNumber = '';
  let isUnique = false;

  while (!isUnique) {
    accountNumber = generateAccountNumber();
    const existing = await User.findOne({ accountNumber });
    if (!existing) isUnique = true;
  }

  const user = new User({
    firstName,
    surname,
    idNumber,
    username,
    accountNumber,
    passwordHash,
  });

  await user.save();
  return user;
}

export async function verifyUserCredentials(username: string, password: string) {
  const user = await User.findOne({ username });
  if (!user) return false;
  return verifyPasswordHash(password, user.passwordHash);
}
