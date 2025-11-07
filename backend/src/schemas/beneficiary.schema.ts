import { z } from "zod";

// --------------------------------------
// Regex - https://chatgpt.com/ - for regex values
// --------------------------------------
const NAME = /^[A-Za-z][A-Za-z .,'-]{1,59}$/;
const BANK = /^[A-Za-z0-9 .,'-]{2,80}$/;
const BRANCH = /^[A-Za-z0-9-]{2,20}$/;
const ACCOUNT = /^[A-Za-z0-9]{6,34}$/;
const SWIFT = /^[A-Z0-9]{8}(?:[A-Z0-9]{3})?$/;
const COUNTRY = /^[A-Z]{2}$/;
const NOTE = /^[A-Za-z0-9 .,'\-()/_]{0,140}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --------------------------------------
// Local beneficiary
// --------------------------------------
export const LocalBeneficiaryDto = z.object({
  type: z.literal("local"),
  name: z.string().trim().max(60).regex(NAME, "Invalid name"),
  bankName: z.string().trim().max(80).regex(BANK, "Invalid bank name"),
  branchCode: z.string().trim().max(20).regex(BRANCH, "Invalid branch code"),
  accountNumber: z.string().trim().max(34).regex(ACCOUNT, "Invalid account number"),
  email: z.string().trim().max(254).regex(EMAIL, "Invalid email").optional(),
  reference: z.string().trim().max(140).regex(NOTE).optional(),
}).strict();

// --------------------------------------
// Foreign beneficiary
// --------------------------------------
export const ForeignBeneficiaryDto = z.object({
  type: z.literal("foreign"),
  name: z.string().trim().max(60).regex(NAME, "Invalid name"),
  country: z.string().trim().toUpperCase().regex(COUNTRY, "Invalid country"),
  swiftBic: z.string().trim().toUpperCase().regex(SWIFT, "Invalid SWIFT/BIC"),
  ibanOrAccount: z.string().trim().toUpperCase().max(34).regex(ACCOUNT, "Invalid IBAN/Account"),
  bankName: z.string().trim().max(80).regex(BANK).optional(),
  email: z.string().trim().max(254).regex(EMAIL).optional(),
  reference: z.string().trim().max(140).regex(NOTE).optional(),
}).strict();

export const CreateBeneficiarySchema = z.object({
  body: z.discriminatedUnion("type", [LocalBeneficiaryDto, ForeignBeneficiaryDto]),
  params: z.unknown().optional(),
  query: z.unknown().optional(),
}).strict();

export const ListBeneficiariesSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    type: z.enum(["local", "foreign"]).optional(),
  }).strict(),
  body: z.unknown().optional(),
  params: z.unknown().optional(),
}).strict();
