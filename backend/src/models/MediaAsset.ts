import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaAsset extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  url: string;
  secureUrl?: string;
  webpUrl: string;
  thumbnailUrl: string;
  publicId?: string;
  storageProvider: 'cloudinary' | 'local';
  folder?: string;
  format?: string;
  resourceType?: 'image' | 'video' | 'raw';
  category: 
    | 'welcome' 
    | 'ganesha' 
    | 'hero' 
    | 'bride' 
    | 'groom' 
    | 'couple' 
    | 'our-story' 
    | 'haldi' 
    | 'mehndi' 
    | 'tilak' 
    | 'wedding' 
    | 'family' 
    | 'gallery' 
    | 'events'
    | 'venue' 
    | 'decorations';
  sectionPlacement?: string;
  altText: string;
  caption?: string;
  description?: string;
  focalPoint: {
    x: number; // percentage 0 - 100
    y: number; // percentage 0 - 100
  };
  isDesktop: boolean;
  isMobile: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    url: { type: String, required: true },
    secureUrl: { type: String },
    webpUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    publicId: { type: String, index: true },
    storageProvider: { type: String, enum: ['cloudinary', 'local'], default: 'local' },
    folder: { type: String },
    format: { type: String },
    resourceType: { type: String, enum: ['image', 'video', 'raw'], default: 'image' },
    category: {
      type: String,
      enum: [
        'welcome',
        'ganesha',
        'hero',
        'bride',
        'groom',
        'couple',
        'our-story',
        'haldi',
        'mehndi',
        'tilak',
        'wedding',
        'family',
        'gallery',
        'events',
        'venue',
        'decorations',
      ],
      default: 'gallery',
      index: true,
    },
    sectionPlacement: { type: String, default: '' },
    altText: { type: String, default: 'Aditi & Nitin Royal Wedding Asset' },
    caption: { type: String, default: '' },
    description: { type: String, default: '' },
    focalPoint: {
      x: { type: Number, default: 50 },
      y: { type: Number, default: 50 },
    },
    isDesktop: { type: Boolean, default: true },
    isMobile: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

MediaAssetSchema.index({ category: 1, order: 1 });
MediaAssetSchema.index({ sectionPlacement: 1 });

export const MediaAsset = mongoose.model<IMediaAsset>('MediaAsset', MediaAssetSchema);
