import mongoose, { Schema, Document } from 'mongoose';

export interface IGuest extends Document {
  name: string;
  phone: string;
  email?: string;
  guestCount: number;
  attendanceStatus: 'CONFIRMED' | 'DECLINED' | 'TENTATIVE';
  selectedEvents: string[];
  dietaryPreference?: 'VEGETARIAN' | 'JAIN' | 'VEGAN' | 'NO_RESTRICTIONS';
  needsAccommodation: boolean;
  message?: string;
  adminNotes?: string;
  whatsappOptIn: boolean;
  checkedIn: boolean;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuest>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    guestCount: { type: Number, required: true, min: 1, max: 20, default: 1 },
    attendanceStatus: {
      type: String,
      enum: ['CONFIRMED', 'DECLINED', 'TENTATIVE'],
      required: true,
      default: 'CONFIRMED',
    },
    selectedEvents: [{ type: String }],
    dietaryPreference: {
      type: String,
      enum: ['VEGETARIAN', 'JAIN', 'VEGAN', 'NO_RESTRICTIONS'],
      default: 'VEGETARIAN',
    },
    needsAccommodation: { type: Boolean, default: false },
    message: { type: String, trim: true, maxlength: 500 },
    adminNotes: { type: String, trim: true, default: '' },
    whatsappOptIn: { type: Boolean, default: true },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
  },
  { timestamps: true }
);

GuestSchema.index({ phone: 1 });
GuestSchema.index({ attendanceStatus: 1 });
GuestSchema.index({ createdAt: -1 });

export const Guest = mongoose.model<IGuest>('Guest', GuestSchema);
