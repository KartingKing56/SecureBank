import { hashPassword, verifyPassword as verifyPasswordHash } from '../utils/password';
import { User } from '../models/User';
import { generateAccountNumber } from '../utils/accountNumber';

//--------------------------------------
// User input creation.
//--------------------------------------
type CreateUserInput = {
  firstName: string;
  surname: string;
  idNumber: string;
  username: string;
  password: string;
};

//--------------------------------------
// Create secure user function
//--------------------------------------
export async function createUserSecure(input: CreateUserInput) {
  const firstName = input.firstName.trim();
  const surname   = input.surname.trim();
  const idNumber  = input.idNumber.trim();
  const username  = input.username.trim().toLowerCase();
  const password  = input.password;

  const passwordHash = await hashPassword(password);

  for (let attempt = 0; attempt < 5; attempt++) {
    const accountNumber = generateAccountNumber();

    //--------------------------------------
    // Checks for duplicates in collections
    //--------------------------------------
    try {
      const user = await User.create({
        firstName,
        surname,
        idNumber,
        username,
        accountNumber,
        passwordHash,
      });
      return user;
    } catch (err: any) {
      if (err?.code === 11000) {
        if (err.keyPattern?.username) {
          const e: any = new Error('UsernameAlreadyTaken');
          e.status = 409;
          throw e;
        }
        if (err.keyPattern?.idNumber) {
          const e: any = new Error('IdNumberAlreadyUsed');
          e.status = 409;
          throw e;
        }
        if (err.keyPattern?.accountNumber) {
          if (attempt < 4) continue;
          const e: any = new Error('AccountNumberCollision');
          e.status = 500;
          throw e;
        }
      }
      throw err;
    }
  }

  const e: any = new Error('FailedToCreateUser');
  e.status = 500;
  throw e;
}

//--------------------------------------
// User details verification
//--------------------------------------
export async function verifyUserCredentials(
  username: string,
  accountNumber: string,
  password: string
) {
  const user = await User.findOne({
    username: username.trim().toLowerCase(),
    accountNumber: accountNumber.trim(),
  });
  if (!user || !user.passwordHash) return false;
  return verifyPasswordHash(password, user.passwordHash);
}
