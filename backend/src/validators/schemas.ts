import { z } from 'zod';

export const rsvpValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  guestCount: z.coerce.number().int().min(1, 'Minimum 1 guest').max(20, 'Maximum 20 guests'),
  attendanceStatus: z.enum(['CONFIRMED', 'DECLINED', 'TENTATIVE']),
  selectedEvents: z.array(z.string()).default([]),
  dietaryPreference: z.enum(['VEGETARIAN', 'JAIN', 'VEGAN', 'NO_RESTRICTIONS']).default('VEGETARIAN'),
  needsAccommodation: z.boolean().default(false),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional().or(z.literal('')),
  adminNotes: z.string().max(1000).optional().or(z.literal('')),
  whatsappOptIn: z.boolean().default(true),
});

export const loginValidationSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

export const adminUserSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER', 'CONTENT_MANAGER', 'MEDIA_MANAGER', 'RSVP_MANAGER', 'COORDINATOR']),
  isActive: z.boolean().default(true),
});

export const eventValidationSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  titleHi: z.string().optional(),
  slug: z.string().min(2),
  description: z.string().min(5),
  descriptionHi: z.string().optional(),
  date: z.string(),
  formattedDate: z.string().optional(),
  formattedDateHi: z.string().optional(),
  startTime: z.string().optional().default(''),
  endTime: z.string().optional().default(''),
  venue: z.string(),
  venueHi: z.string().optional(),
  address: z.string(),
  addressHi: z.string().optional(),
  image: z.union([
    z.string().min(1),
    z.object({
      secureUrl: z.string().min(1),
      url: z.string().optional(),
      publicId: z.string().optional(),
    }).transform((val) => val.secureUrl || val.url || ''),
  ]),
  publicId: z.string().optional(),
  dressCode: z.string().default('Traditional'),
  dressCodeHi: z.string().optional(),
  accentColor: z.string().optional(),
  badgeColor: z.string().optional(),
  mapUrl: z.string(),
  order: z.coerce.number().default(1),
});

export const galleryValidationSchema = z.object({
  title: z.string().min(2),
  titleHi: z.string().optional(),
  caption: z.string().optional().default(''),
  imageUrl: z.union([
    z.string().min(1),
    z.object({
      secureUrl: z.string().min(1),
      url: z.string().optional(),
      publicId: z.string().optional(),
    }).transform((val) => val.secureUrl || val.url || ''),
  ]),
  thumbnailUrl: z.string().optional(),
  publicId: z.string().optional(),
  category: z.string().min(1).default('couple'),
  categoryLabel: z.string().optional(),
  categoryLabelHi: z.string().optional(),
  isPublished: z.boolean().default(true),
  order: z.coerce.number().default(1),
});

export const mediaMetadataSchema = z.object({
  category: z.enum([
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
  ]),
  sectionPlacement: z.string().optional(),
  altText: z.string().min(2).max(200),
  caption: z.string().max(300).optional(),
  description: z.string().max(1000).optional(),
  focalPointX: z.coerce.number().min(0).max(100).default(50),
  focalPointY: z.coerce.number().min(0).max(100).default(50),
  isDesktop: z.boolean().default(true),
  isMobile: z.boolean().default(true),
  order: z.coerce.number().default(1),
});

export const musicTrackSchema = z.object({
  title: z.string().min(2, 'Track title required').max(100),
  artist: z.string().min(2, 'Artist required').max(100),
  fileUrl: z.string().min(1),
  duration: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  volume: z.coerce.number().min(0.0).max(1.0).default(0.5),
  loop: z.boolean().default(true),
});

export const qrGenerateSchema = z.object({
  title: z.string().min(2).max(100),
  type: z.enum(['INVITATION', 'VENUE', 'RSVP', 'WHATSAPP', 'CUSTOM']),
  destinationUrl: z.string().url('A valid destination URL is required'),
  darkColor: z.string().default('#780016'),
  lightColor: z.string().default('#ffffff'),
});

export const appearanceSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Valid hex color code required'),
  secondaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Valid hex color code required'),
  enableFloatingParticles: z.boolean().default(true),
  enableFlowerPetals: z.boolean().default(true),
  enableMusicAutoplay: z.boolean().default(false),
});

export const seoSchema = z.object({
  metaTitle: z.string().min(10).max(120),
  metaDescription: z.string().min(20).max(300),
  ogImage: z.string().min(1),
  keywords: z.array(z.string()).default([]),
});
