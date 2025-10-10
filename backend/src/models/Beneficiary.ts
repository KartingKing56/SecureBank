import { Schema, model, Types, Document } from 'mongoose';

export type BeneficiaryType = 'local' | 'foreign';

//--------------------------------------
// Beneficiary model
//--------------------------------------
export interface IBeneficiary extends Document {
  userId: Types.ObjectId;
  type: BeneficiaryType;

  name: string;
  email?: string;
  reference?: string;

  bankName?: string;
  branchCode?: string;
  accountNumber?: string;

  country?: string;
  swiftBic?: string;
  ibanOrAccount?: string;

  createdAt: Date;
  updatedAt: Date;
}

//--------------------------------------
// Schema setup for beneficiary model.
//--------------------------------------
const BeneficiarySchema = new Schema<IBeneficiary>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['local', 'foreign'], required: true, index: true },

    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    reference: { type: String, trim: true },

    bankName: { type: String, trim: true },
    branchCode: { type: String, trim: true },
    accountNumber: { type: String, trim: true },

    country: { type: String, uppercase: true, trim: true },
    swiftBic: { type: String, uppercase: true, trim: true },
    ibanOrAccount: { type: String, uppercase: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

BeneficiarySchema.index(
  { userId: 1, type: 1, name: 1, accountNumber: 1, ibanOrAccount: 1, swiftBic: 1 },
  { unique: true, sparse: true, name: 'uniq_beneficiary_per_user' }
);

export const Beneficiary = model<IBeneficiary>('Beneficiary', BeneficiarySchema);
