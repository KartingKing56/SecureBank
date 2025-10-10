import mongoose, { Schema, Document, Types } from 'mongoose';

//--------------------------------------
// User model
//--------------------------------------
export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  surname: string;
  idNumber: string;
  username: string;
  accountNumber: string;
  passwordHash: string;
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
  },
  {
    timestamps: true,
    versionKey: false,
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
    collation: { locale: 'en', strength: 2 },
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);