import mongoose, { Schema, Document } from 'mongoose';

export interface IMusicTrack extends Document {
  title: string;
  artist: string;
  fileUrl: string;
  secureUrl?: string;
  publicId?: string;
  storageProvider?: 'cloudinary' | 'local';
  resourceType?: string;
  format?: string;
  originalName: string;
  fileSize: number;
  duration?: number;
  isActive: boolean;
  isDefault: boolean;
  volume: number; // 0.0 - 1.0
  loop: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MusicTrackSchema = new Schema<IMusicTrack>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, default: 'Traditional Shehnai & Sitar', trim: true },
    fileUrl: { type: String, required: true },
    secureUrl: { type: String },
    publicId: { type: String, index: true },
    storageProvider: { type: String, enum: ['cloudinary', 'local'], default: 'local' },
    resourceType: { type: String, default: 'video' },
    format: { type: String },
    originalName: { type: String, default: 'audio.mp3' },
    fileSize: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    volume: { type: Number, default: 0.5, min: 0.0, max: 1.0 },
    loop: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

MusicTrackSchema.index({ isActive: 1, isDefault: 1 });

export const MusicTrack = mongoose.model<IMusicTrack>('MusicTrack', MusicTrackSchema);
