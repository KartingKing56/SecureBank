import { z } from 'zod';
import { TX_REGEX } from '../utils/regex.tx';

export const BeneficiaryDto = z.object({
  name: z.string().regex(TX_REGEX.name),
  bankName: z.string().regex(TX_REGEX.bankName).optional(),
  ibanOrAccount: z.string().toUpperCase().regex(TX_REGEX.ibanOrAccount),
});

export const CreateTxSchema = z.object({
  body: z.object({
    amount: z.string().regex(TX_REGEX.amount),
    currency: z.string().toUpperCase().regex(TX_REGEX.currency),
    provider: z.string().regex(TX_REGEX.provider),
    beneficiary: BeneficiaryDto,
    note: z.string().regex(TX_REGEX.note).optional(),
  }),
});

export const ListTxSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(10).optional(),
    status: z.enum(['pending','queued','forwarded','failed']).optional(),
  }).partial(),
});
