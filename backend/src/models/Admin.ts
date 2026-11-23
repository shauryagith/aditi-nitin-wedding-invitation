import mongoose, { Schema, Document } from 'mongoose';

export type AdminRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN'
  | 'EDITOR'
  | 'VIEWER'
  | 'CONTENT_MANAGER' 
  | 'MEDIA_MANAGER' 
  | 'RSVP_MANAGER' 
  | 'COORDINATOR';

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  failedLoginAttempts: number;
  lockUntil?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER', 'CONTENT_MANAGER', 'MEDIA_MANAGER', 'RSVP_MANAGER', 'COORDINATOR'],
      default: 'ADMIN',
    },
    isActive: { type: Boolean, default: true },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
