import mongoose, { Schema, model, Types, Document } from "mongoose";
import { REGEX } from "../utils/regex";
import { TX_REGEX } from "../utils/regex.tx";

export type BeneficiaryType = "local" | "foreign";

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

const BeneficiarySchema = new Schema<IBeneficiary>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    type: { type: String, enum: ["local", "foreign"], required: true, index: true },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
      match: TX_REGEX.name,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    reference: {
      type: String,
      trim: true,
      maxlength: 35,
      match: /^[A-Za-z0-9 .,'\-/_]{0,35}$/,
    },

    bankName: {
      type: String,
      trim: true,
      maxlength: 80,
      match: TX_REGEX.bankName,
    },
    branchCode: {
      type: String,
      trim: true,
      maxlength: 12,
      match: /^[A-Za-z0-9\-]{2,12}$/,
    },
    accountNumber: {
      type: String,
      trim: true,
      maxlength: 34,
      match: /^[0-9]{6,20}$/,
    },

    country: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 2,
      match: /^[A-Z]{2}$/,
    },
    swiftBic: {
      type: String,
      uppercase: true,
      trim: true,
      match: (TX_REGEX as any).swiftBic ?? /^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
    },
    ibanOrAccount: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 34,
      match: TX_REGEX.ibanOrAccount,
    },
  },
  { timestamps: true, versionKey: false }
);

BeneficiarySchema.pre("validate", function (next) {
  const b = this as IBeneficiary;

  if (b.type === "local") {
    if (!b.bankName || !b.branchCode || !b.accountNumber) {
      return next(new Error("local beneficiary requires bankName, branchCode, accountNumber"));
    }
    if (!b.country) delete (b as any).country;
    if (!b.swiftBic) delete (b as any).swiftBic;
    if (!b.ibanOrAccount) delete (b as any).ibanOrAccount;
  }

  if (b.type === "foreign") {
    if (!b.country || !b.swiftBic || !b.ibanOrAccount) {
      return next(new Error("foreign beneficiary requires country, swiftBic, ibanOrAccount"));
    }
    if (!b.branchCode) delete (b as any).branchCode;
    if (!b.accountNumber) delete (b as any).accountNumber;
  }

  next();
});

BeneficiarySchema.index(
  { userId: 1, type: 1, name: 1, accountNumber: 1 },
  { unique: true, sparse: true, name: "uniq_local_beneficiary_per_user" }
);
BeneficiarySchema.index(
  { userId: 1, type: 1, name: 1, ibanOrAccount: 1, swiftBic: 1 },
  { unique: true, sparse: true, name: "uniq_foreign_beneficiary_per_user" }
);

export const Beneficiary = model<IBeneficiary>("Beneficiary", BeneficiarySchema);
