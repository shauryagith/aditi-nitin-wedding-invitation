import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  titleHi?: string;
  caption?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  publicId?: string;
  category: string;
  categoryLabel?: string;
  categoryLabelHi?: string;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    titleHi: { type: String },
    caption: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    publicId: { type: String },
    category: {
      type: String,
      required: true,
      default: 'couple',
    },
    categoryLabel: { type: String },
    categoryLabelHi: { type: String },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

GallerySchema.index({ category: 1, order: 1 });
GallerySchema.index({ isPublished: 1, order: 1 });

export const Gallery = mongoose.model<IGallery>('Gallery', GallerySchema);
