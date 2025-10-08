import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    surname: string;
    idNumber: string;
    username: string;
    accountNumber: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        firstName: { type: String, required: true, trim: true },
        surname: { type: String, required: true, trim: true },
        idNumber: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        accountNumber: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

