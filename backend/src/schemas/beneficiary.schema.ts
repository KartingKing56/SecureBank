import { z } from 'zod';
import { TX_REGEX } from '../utils/regex.tx';

const Common = {
  name: z.string().regex(TX_REGEX.name),
  bankName: z.string().regex(TX_REGEX.bankName).optional(),
};

const LocalBeneficiaryDto = z.object({
  type: z.literal('local'),
  name: Common.name,
  bankName: Common.bankName,
  branchCode: z.string().regex(TX_REGEX.branchCode, 'Invalid branch code'),
  accountNumber: z.string().regex(TX_REGEX.accountNumber, 'Invalid account number'),
  accountType: z.enum(['savings', 'cheque']),
  reference: z.string().max(140).optional(),
  email: z.string().regex(TX_REGEX.email).optional(),
});

const ForeignBeneficiaryDto = z.object({
  type: z.literal('foreign'),
  name: Common.name,
  bankName: Common.bankName,
  country: z.string().regex(TX_REGEX.country, 'Use 2-letter country code'),
  swiftBic: z.string().regex(TX_REGEX.swiftBic, 'Invalid SWIFT/BIC'),
  ibanOrAccount: z.string().regex(TX_REGEX.iban, 'Invalid IBAN format'),
  reference: z.string().max(140).optional(),
  email: z.string().regex(TX_REGEX.email).optional(),
});

export const CreateBeneficiarySchema = z.object({
  body: z.discriminatedUnion('type', [LocalBeneficiaryDto, ForeignBeneficiaryDto]),
});
