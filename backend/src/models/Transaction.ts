import { Schema, model, Types, Document } from 'mongoose';
import { TX_REGEX } from '../utils/regex.tx';

export type TxStatus = 'pending' | 'queued' | 'forwarded' | 'failed';

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  reference: string;
  amount: string;
  currency: string;
  provider: 'SWIFT';
  beneficiary: {
    name: string;
    bankName?: string;
    ibanOrAccount: string;
  };
  note?: string;
  status: TxStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BeneficiarySub = new Schema<ITransaction['beneficiary']>(
  {
    name: { type: String, required: true, match: TX_REGEX.name, trim: true },
    bankName: { type: String, match: TX_REGEX.bankName, trim: true },
    ibanOrAccount: { type: String, required: true, uppercase: true, match: TX_REGEX.ibanOrAccount },
  },
  { _id: false }
);

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reference: { type: String, required: true, unique: true, index: true },
    amount: { type: String, required: true, match: TX_REGEX.amount },
    currency: { type: String, required: true, uppercase: true, match: TX_REGEX.currency },
    provider: { type: String, required: true, enum: ['SWIFT'] },
    beneficiary: { type: BeneficiarySub, required: true },
    note: { type: String, match: TX_REGEX.note },
    status: { type: String, enum: ['pending','queued','forwarded','failed'], default: 'pending', index: true },
  },
  { timestamps: true, versionKey: false }
);

export const Transaction = model<ITransaction>('Transaction', TransactionSchema);
