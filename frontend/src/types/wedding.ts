export type AttendanceStatus = 'CONFIRMED' | 'DECLINED' | 'TENTATIVE' | 'PENDING';

export interface WeddingFamilyMember {
  relation: string;
  relationHi?: string;
  name: string;
  nameHi?: string;
}

export interface WeddingCoupleInfo {
  name: string;
  nameHi: string;
  fullName: string;
  fullNameHi: string;
  role: 'Bride' | 'Groom';
  roleHi: string;
  mother: string;
  motherHi: string;
  father: string;
  fatherHi: string;
  bio: string;
  bioHi: string;
  photoUrl: string;
  image?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
}

export interface WeddingEventItem {
  id: string;
  slug: string;
  title: string;
  titleHi: string;
  date: string; // ISO date or '2026-12-11'
  formattedDate: string;
  formattedDateHi: string;
  startTime?: string | null; // Editable ceremony timing, displayed ONLY when configured
  endTime?: string | null;
  venue: string;
  venueHi: string;
  address: string;
  addressHi: string;
  description: string;
  descriptionHi: string;
  image: string;
  publicId?: string;
  dressCode?: string;
  dressCodeHi?: string;
  accentColor: string; // Theme accent color
  badgeColor: string;
  mapUrl: string;
  order: number;
}

export interface StoryMilestone {
  id: string;
  title: string;
  titleHi: string;
  dateStr?: string;
  dateStrHi?: string;
  date?: string;
  description: string;
  descriptionHi: string;
  image: string;
  imageUrl?: string;
  quote?: string;
  quoteHi?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  titleHi?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  publicId?: string;
  isPublished?: boolean;
  category:
    | 'all'
    | 'aditi-nitin'
    | 'pre-wedding'
    | 'family-moments'
    | 'wedding-celebrations'
    | 'wedding-traditions'
    | 'couple'
    | 'haldi'
    | 'mehndi'
    | 'tilak'
    | 'wedding'
    | 'family'
    | 'ceremony';
  categoryLabel: string;
  categoryLabelHi: string;
  order: number;
  caption?: string;
}

export interface WeddingVenueInfo {
  name: string;
  nameHi: string;
  address: string;
  addressHi: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  mapUrl: string;
  embedMapUrl: string;
  photoUrl: string;
  directionsTips?: string;
  directionsTipsHi?: string;
}

export interface WeddingConfig {
  bride: WeddingCoupleInfo;
  groom: WeddingCoupleInfo;
  weddingDate: string; // '2026-12-11T19:00:00+05:30'
  weddingDateFormatted: string;
  weddingDateFormattedHi: string;
  timezone: string; // 'Asia/Kolkata'
  venue: WeddingVenueInfo;
  traditionalBlessing: {
    sanskrit: string;
    english: string;
    hindi: string;
  };
  invitationMessage: {
    english: string;
    hindi: string;
  };
  storyMilestones: StoryMilestone[];
  contact: {
    primaryPhone: string;
    whatsappNumber: string;
    email: string;
  };
  music: {
    title: string;
    artist: string;
    audioUrl: string;
  };
  seo: {
    title: string;
    description: string;
    siteUrl: string;
    ogImage: string;
  };
  heroSlides?: HeroSlideItem[];
  familyMembers?: any[];
}

export interface RsvpFormData {
  name: string;
  phone: string;
  email?: string;
  guestCount: number;
  attendanceStatus: 'CONFIRMED' | 'DECLINED';
  selectedEvents: string[];
  message?: string;
  whatsappOptIn: boolean;
}

export interface GuestRecord extends RsvpFormData {
  _id?: string;
  createdAt: string;
}


export interface MediaAssetItem {
  _id: string;
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
  storageProvider?: 'cloudinary' | 'local';
  category: string;
  sectionPlacement?: string;
  altText: string;
  caption?: string;
  description?: string;
  focalPoint: { x: number; y: number };
  isDesktop: boolean;
  isMobile: boolean;
  order: number;
  createdAt: string;
}

export interface MusicTrackItem {
  _id: string;
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
  volume: number;
  loop: boolean;
  order: number;
  createdAt: string;
}

export interface QRCodeItem {
  _id: string;
  title: string;
  type: 'INVITATION' | 'VENUE' | 'RSVP' | 'WHATSAPP' | 'CUSTOM';
  destinationUrl: string;
  qrDataUrl: string;
  svgContent?: string;
  darkColor: string;
  lightColor: string;
  scanCount: number;
  lastScannedAt?: string;
  verifiedPayload?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ActivityLogItem {
  _id: string;
  adminId?: string;
  adminEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AdminUserItem {
  _id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'CONTENT_MANAGER' | 'MEDIA_MANAGER' | 'RSVP_MANAGER' | 'ADMIN' | 'COORDINATOR';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface HeroSlideItem {
  id: string;
  desktopImage: string;
  mobileImage?: string;
  title: string;
  subtitle: string;
  dateBadge: string;
  order: number;
  isActive: boolean;
}
