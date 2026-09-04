import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'tenant' | 'owner' | 'admin';
  avatar?: string;
  phone?: string;
  bio?: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['tenant', 'owner', 'admin'], default: 'tenant' },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
