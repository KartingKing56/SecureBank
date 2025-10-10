import { Schema, model, Document, Types } from 'mongoose';

export type BeneficiaryType = 'local' | 'foreign';

export interface IBeneficiary extends Document {
  userId: Types.ObjectId;
  type: BeneficiaryType;

  name: string;
  bankName?: string;

  branchCode?: string;
  accountNumber?: string;
  accountType?: 'savings' | 'cheque';
  reference?: string;
  email?: string;

  country?: string;
  swiftBic?: string;
  ibanOrAccount?: string;

  createdAt: Date;
  updatedAt: Date;
}

const BeneficiarySchema = new Schema<IBeneficiary>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['local', 'foreign'], required: true },

    name: { type: String, required: true, trim: true, maxlength: 60 },
    bankName: { type: String, trim: true, maxlength: 80 },

    branchCode: { type: String },
    accountNumber: { type: String },
    accountType: { type: String, enum: ['savings', 'cheque'] },
    reference: { type: String, maxlength: 140 },
    email: { type: String, lowercase: true, trim: true },

    country: { type: String, uppercase: true, minlength: 2, maxlength: 2 },
    swiftBic: { type: String, uppercase: true },
    ibanOrAccount: { type: String, uppercase: true },
  },
  { timestamps: true, versionKey: false }
);

export const Beneficiary = model<IBeneficiary>('Beneficiary', BeneficiarySchema);
