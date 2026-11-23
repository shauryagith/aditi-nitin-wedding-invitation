import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  adminId?: string;
  adminEmail: string;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'RESTORE' | 'SETTINGS_CHANGE';
  entity: string; // e.g. 'GUEST', 'EVENT', 'MEDIA', 'MUSIC', 'QR', 'WEDDING_SETTINGS', 'AUTH'
  entityId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    adminId: { type: String },
    adminEmail: { type: String, required: true },
    action: {
      type: String,
      enum: ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'RESTORE', 'SETTINGS_CHANGE'],
      required: true,
    },
    entity: { type: String, required: true },
    entityId: { type: String },
    details: { type: String, required: true },
    ipAddress: { type: String, default: '127.0.0.1' },
    userAgent: { type: String, default: 'Unknown' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ adminEmail: 1, action: 1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
