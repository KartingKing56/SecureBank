import { z } from "zod";
import { TX_REGEX } from "../utils/regex.tx";

export const BeneficiaryDto = z
  .object({
    name: z.string().trim().max(60).regex(TX_REGEX.name, "Invalid beneficiary name"),
    bankName: z.string().trim().max(80).regex(TX_REGEX.bankName).optional(),
    ibanOrAccount: z
      .string()
      .trim()
      .toUpperCase()
      .max(34)
      .regex(TX_REGEX.ibanOrAccount, "Invalid IBAN/Account"),
  })
  .strict();

export const CreateTxSchema = z
  .object({
    body: z
      .object({
        amount: z.string().trim().regex(TX_REGEX.amount, "Invalid amount"),
        currency: z.string().trim().toUpperCase().regex(TX_REGEX.currency, "Invalid currency"),
        swiftBic: z
          .string()
          .trim()
          .toUpperCase()
          .regex((TX_REGEX as any).swiftBic ?? /^[A-Z0-9]{8}([A-Z0-9]{3})?$/, "Invalid SWIFT/BIC"),
        beneficiary: BeneficiaryDto,
        note: z.string().trim().max(140).regex(TX_REGEX.note).optional(),
      })
      .strict(),
  })
  .strict();

export const ListTxSchema = z
  .object({
    query: z
      .object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(10),
        status: z.enum(["pending", "verified", "queued", "forwarded", "failed"]).optional(),
      })
      .strict(),
  })
  .strict();
