import { z } from 'zod';

const NAME = /^[A-Za-z][A-Za-z .,'-]{1,59}$/;
const BANK = /^[A-Za-z0-9 .,'-]{2,80}$/;
const BRANCH = /^[A-Za-z0-9-]{2,20}$/;
const ACCOUNT = /^[A-Za-z0-9]{6,34}$/;
const SWIFT = /^[A-Z0-9]{8}(?:[A-Z0-9]{3})?$/;
const COUNTRY = /^[A-Z]{2}$/;
const NOTE = /^[A-Za-z0-9 .,'\-()/_]{0,140}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LocalBeneficiaryDto = z.object({
  type: z.literal('local'),
  name: z.string().regex(NAME, 'Invalid name'),
  bankName: z.string().regex(BANK, 'Invalid bank name'),
  branchCode: z.string().regex(BRANCH, 'Invalid branch code'),
  accountNumber: z.string().regex(ACCOUNT, 'Invalid account number'),
  email: z.string().regex(EMAIL, 'Invalid email').optional(),
  reference: z.string().regex(NOTE).optional(),
});

export const ForeignBeneficiaryDto = z.object({
  type: z.literal('foreign'),
  name: z.string().regex(NAME, 'Invalid name'),
  country: z.string().toUpperCase().regex(COUNTRY, 'Invalid country'),
  swiftBic: z.string().toUpperCase().regex(SWIFT, 'Invalid SWIFT/BIC'),
  ibanOrAccount: z.string().toUpperCase().regex(ACCOUNT, 'Invalid IBAN/Account'),
  bankName: z.string().regex(BANK).optional(),
  email: z.string().regex(EMAIL).optional(),
  reference: z.string().regex(NOTE).optional(),
});

export const CreateBeneficiarySchema = z.object({
  body: z.discriminatedUnion('type', [LocalBeneficiaryDto, ForeignBeneficiaryDto]),
});

export const ListBeneficiariesSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(10).optional(),
    type: z.enum(['local', 'foreign']).optional(),
  }).partial(),
});
