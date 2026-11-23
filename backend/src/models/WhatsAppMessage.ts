import mongoose, { Schema, Document } from 'mongoose';

export interface IWhatsAppMessage extends Document {
  guestId?: mongoose.Types.ObjectId;
  phone: string;
  templateName: string;
  messageType: 'INVITATION' | 'REMINDER' | 'VENUE' | 'CUSTOM';
  providerMessageId?: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  error?: string;
  sentAt: Date;
  deliveredAt?: Date;
}

const WhatsAppMessageSchema = new Schema<IWhatsAppMessage>(
  {
    guestId: { type: Schema.Types.ObjectId, ref: 'Guest' },
    phone: { type: String, required: true },
    templateName: { type: String, required: true },
    messageType: {
      type: String,
      enum: ['INVITATION', 'REMINDER', 'VENUE', 'CUSTOM'],
      default: 'REMINDER',
    },
    providerMessageId: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'],
      default: 'PENDING',
    },
    error: { type: String },
    sentAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

WhatsAppMessageSchema.index({ phone: 1, status: 1 });

export const WhatsAppMessage = mongoose.model<IWhatsAppMessage>('WhatsAppMessage', WhatsAppMessageSchema);
