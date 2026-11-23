import mongoose, { Schema, Document } from 'mongoose';

export interface IQRCode extends Document {
  title: string;
  type: 'INVITATION' | 'VENUE' | 'RSVP' | 'WHATSAPP' | 'CUSTOM';
  destinationUrl: string;
  qrDataUrl: string; // Base64 PNG data URI
  svgContent?: string;
  darkColor: string; // Hex color for modules
  lightColor: string; // Hex color for background
  scanCount: number;
  lastScannedAt?: Date;
  verifiedPayload?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QRCodeSchema = new Schema<IQRCode>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['INVITATION', 'VENUE', 'RSVP', 'WHATSAPP', 'CUSTOM'],
      required: true,
      default: 'INVITATION',
    },
    destinationUrl: { type: String, required: true },
    qrDataUrl: { type: String, required: true },
    svgContent: { type: String },
    darkColor: { type: String, default: '#780016' }, // Royal burgundy
    lightColor: { type: String, default: '#ffffff' },
    scanCount: { type: Number, default: 0 },
    lastScannedAt: { type: Date },
    verifiedPayload: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

QRCodeSchema.index({ type: 1, isActive: 1 });

export const QRCode = mongoose.model<IQRCode>('QRCode', QRCodeSchema);
