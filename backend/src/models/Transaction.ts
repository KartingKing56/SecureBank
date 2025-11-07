import mongoose, { Schema, model, Types, Document } from 'mongoose';
import { TX_REGEX } from '../utils/regex.tx';

export type TxStatus = "pending" | "verified" | "queued" | "forwarded" | "failed";

//--------------------------------------
// Transaction model.
//--------------------------------------
export interface ITransaction extends Document {
  userId: Types.ObjectId;
  reference: string;
  amount: mongoose.Types.Decimal128;
  currency: string;
  provider: 'SWIFT';
  swiftBic: string;
  beneficiary: {
    name: string;
    bankName?: string;
    ibanOrAccount: string;
  };
  note?: string;
  status: TxStatus;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  submittedBy?: Types.ObjectId;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BeneficiarySub = new Schema<ITransaction['beneficiary']>(
  {
    name: { 
      type: String, 
      required: true, 
      match: TX_REGEX.name, 
      trim: true },
    bankName: { 
      type: String, 
      match: TX_REGEX.bankName, 
      trim: true },
    ibanOrAccount: { 
      type: String, 
      required: true, 
      uppercase: true, 
      match: TX_REGEX.ibanOrAccount },
  },
  { _id: false }
);

//--------------------------------------
// Transaction model schema
//--------------------------------------
const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reference: { 
      type: String, 
      required: true,
      unique: true,
      index: true,
      immutable: true,
    },
    amount: { 
      type: String,
      required: true,
    },
    currency: { 
      type: String,
      required: true,
      uppercase: true,
      match: TX_REGEX.currency
    },
    provider: { 
      type: String,
      required: true,
      enum: ['SWIFT'],
      immutable: true,
    },
    swiftBic: {
      type: String,
      required: true,
      uppercase: true,
      match: (TX_REGEX as any).swiftBic,
    },
    beneficiary: { 
      type: BeneficiarySub,
      required: true
    },
    note: { 
      type: String,
      match: TX_REGEX.note,
      maxLength: 140,
    },
    status: { 
      type: String,
      enum: ["pending", "verified", "queued", "forwarded", "failed"],
      default: "pending",
      index: true
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: {
      type: Date,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    submittedAt: {
      type: Date,
    },
  },
  { 
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, ret: any) {
        if (ret.amount?.toString) ret.amount = ret.amount.toString();
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret: any) {
        if (ret.amount?.toString) ret.amount = ret.amount.toString();
        return ret;
      },
    },
  }
);

//--------------------------------------
// Indexes
//--------------------------------------
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ status: 1, createdAt: -1 });

export const Transaction = model<ITransaction>('Transaction', TransactionSchema);
