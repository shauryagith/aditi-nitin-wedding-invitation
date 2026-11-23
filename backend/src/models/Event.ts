import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  titleHi?: string;
  slug: string;
  description: string;
  descriptionHi?: string;
  date: string;
  formattedDate?: string;
  formattedDateHi?: string;
  startTime?: string;
  endTime?: string;
  venue: string;
  venueHi?: string;
  address: string;
  addressHi?: string;
  image: string;
  publicId?: string;
  dressCode?: string;
  dressCodeHi?: string;
  accentColor?: string;
  badgeColor?: string;
  mapUrl: string;
  order: number;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    titleHi: { type: String },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    descriptionHi: { type: String },
    date: { type: String, required: true },
    formattedDate: { type: String },
    formattedDateHi: { type: String },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    venue: { type: String, required: true },
    venueHi: { type: String },
    address: { type: String, required: true },
    addressHi: { type: String },
    image: { type: String, required: true },
    publicId: { type: String },
    dressCode: { type: String, default: 'Traditional' },
    dressCodeHi: { type: String },
    accentColor: { type: String, default: '#D4AF37' },
    badgeColor: { type: String, default: 'bg-amber-500 text-maroon-950' },
    mapUrl: { type: String, required: true },
    order: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

EventSchema.index({ order: 1 });
EventSchema.index({ slug: 1 });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
