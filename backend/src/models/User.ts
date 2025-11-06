import mongoose, { Schema, Document, Types } from 'mongoose';

//--------------------------------------
// User model
//--------------------------------------

export type UserRole = "customer" | "employee" | "admin";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  surname: string;
  idNumber: string;
  username: string;
  accountNumber: string;
  passwordHash: string;
  role: UserRole;
  employee?: {
    staffId: string;
    department?: string;
    active: boolean;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

//--------------------------------------
// Regex for User model
//--------------------------------------
const nameRegex = /^[A-Za-z]{2,40}$/;
const usernameRegex = /^[A-Za-z0-9_]{4,20}$/;
const idRegex = /^\d{13}$/;
const accountRegex = /^\d{10}$/;
const staffIdRegex = /^[A-Z0-9\-]{3,32}$/;

const COLLATION = { locale: "en", strength: 2 };

//--------------------------------------
// SA ID validation check
//--------------------------------------
function isValidSouthAfricanId(id: string): boolean {
  if (!idRegex.test(id)) return false;
  return true;
}

//--------------------------------------
// User model schema
//--------------------------------------
const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
      match: nameRegex,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 40,
      match: nameRegex,
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
      match: idRegex,
      immutable: true,
      validate: {
        validator: isValidSouthAfricanId,
        message: "Invalid South African ID number",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: usernameRegex,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      match: accountRegex,
      immutable: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "employee", "admin"],
      default: "customer",
      index: true,
    },
    employee: {
      staffId: { type: String, match: staffIdRegex, sparse: true },
      department: { type: String, maxLength: 40 },
      active: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collation: COLLATION,
    toJSON: {
    transform(_doc, ret: Record<string, any>) {
        delete ret.passwordHash;
        return ret;
    },
    },
    toObject: {
      transform(_doc, ret: Record<string, any>) {
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

//--------------------------------------
// Indexes
//--------------------------------------
UserSchema.index({ username: 1 }, { unique: true, collation: COLLATION });
UserSchema.index({ idNumber: 1}, { unique: true });
UserSchema.index({ accountNumber: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ "employee.staffId": 1 }, { unique: true, sparse: true });

//--------------------------------------
// Helpers
//--------------------------------------
UserSchema.methods.toJSON = function () {
  const obj = (this as any).toObject();
  delete obj.passwordHash;
  return obj;
};

UserSchema.pre("save", function (next) {
  if (this.isModified("username") && typeof this.username === "string") {
    this.username = this.username.trim().toLowerCase();
  }
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);