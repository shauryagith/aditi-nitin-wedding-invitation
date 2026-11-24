import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSlide {
  id: string;
  desktopImage: string;
  mobileImage?: string;
  title: string;
  subtitle: string;
  dateBadge: string;
  order: number;
  isActive: boolean;
}

export interface IStoryMilestone {
  id: string;
  title: string;
  titleHi?: string;
  date?: string;
  dateStr?: string;
  dateStrHi?: string;
  description: string;
  descriptionHi?: string;
  image?: string;
  publicId?: string;
  quote?: string;
  quoteHi?: string;
  order: number;
}

export interface IFamilyMember {
  id: string;
  name: string;
  relationship: string;
  side: 'BRIDE' | 'GROOM';
  description?: string;
  image?: string;
  order: number;
}

export interface IWedding extends Document {
  // Couple & Parents
  brideName: string;
  brideNameHi?: string;
  brideBio?: string;
  brideImage?: string;
  brideMother: string;
  brideFather: string;
  groomName: string;
  groomNameHi?: string;
  groomBio?: string;
  groomImage?: string;
  groomMother: string;
  groomFather: string;

  // Wedding Date & Venue
  weddingDate: string; // ISO 8601 string, e.g. '2026-12-11T19:00:00+05:30'
  timezone: string;
  venue: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  directions?: string;
  mapUrl: string;
  invitationMessage: string;
  invitationMessageHi?: string;

  // Dynamic Rich Sections
  heroSlides: IHeroSlide[];
  storyMilestones: IStoryMilestone[];
  familyMembers: IFamilyMember[];

  // Website Appearance
  appearance: {
    primaryColor: string; // Royal burgundy default: #780016
    secondaryColor: string; // Royal gold default: #d4af37
    enableFloatingParticles: boolean;
    enableFlowerPetals: boolean;
    enableMusicAutoplay: boolean;
  };

  // SEO Settings
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    keywords: string[];
  };

  // Website Operational Settings
  websiteSettings: {
    primaryPhone: string;
    whatsappNumber: string;
    musicUrl: string;
    isPublic: boolean;
    maintenanceMode: boolean;
  };

  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    id: { type: String, required: true },
    desktopImage: { type: String, required: true },
    mobileImage: { type: String },
    title: { type: String, default: 'Aditi & Nitin' },
    subtitle: { type: String, default: 'The Royal Wedding Celebration' },
    dateBadge: { type: String, default: 'December 11, 2026' },
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const StoryMilestoneSchema = new Schema<IStoryMilestone>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    titleHi: { type: String },
    date: { type: String },
    dateStr: { type: String },
    dateStrHi: { type: String },
    description: { type: String, required: true },
    descriptionHi: { type: String },
    image: { type: String },
    publicId: { type: String },
    quote: { type: String },
    quoteHi: { type: String },
    order: { type: Number, default: 1 },
  },
  { _id: false }
);

const FamilyMemberSchema = new Schema<IFamilyMember>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    side: { type: String, enum: ['BRIDE', 'GROOM'], required: true },
    description: { type: String },
    image: { type: String },
    order: { type: Number, default: 1 },
  },
  { _id: false }
);

const WeddingSchema = new Schema<IWedding>(
  {
    brideName: { type: String, default: 'Aditi' },
    brideNameHi: { type: String, default: 'अदिति' },
    brideBio: {
      type: String,
      default: 'A graceful soul whose smile radiates warmth and joy. Daughter of Smt. Meera Devi and Shri KBL Srivastava.',
    },
    brideImage: { type: String, default: '/wedding-assets/optimized/aditi-portrait.webp' },
    brideMother: { type: String, default: 'Smt. Meera Devi' },
    brideFather: { type: String, default: 'Shri KBL Srivastava' },

    groomName: { type: String, default: 'Nitin' },
    groomNameHi: { type: String, default: 'नितिन' },
    groomBio: {
      type: String,
      default: 'A visionary leader with a heart of gold. Son of Smt. Suman Joshi and Shri Lalit Mohan Joshi.',
    },
    groomImage: { type: String, default: '/wedding-assets/optimized/nitin-portrait.webp' },
    groomMother: { type: String, default: 'Smt. Suman Joshi' },
    groomFather: { type: String, default: 'Shri Lalit Mohan Joshi' },

    weddingDate: { type: String, default: '2026-12-11T19:00:00+05:30' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    venue: { type: String, default: 'Srivastava Niwas' },
    address: { type: String, default: '002E Bank Colony, Padari Bazaar, Gorakhpur, UP 273014, India' },
    coordinates: {
      lat: { type: Number, default: 26.7865 },
      lng: { type: Number, default: 83.3980 },
    },
    directions: {
      type: String,
      default: 'Located in Padari Bazaar near Bank Colony. Ample parking available at the venue premises.',
    },
    mapUrl: {
      type: String,
      default: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
    },
    invitationMessage: {
      type: String,
      default: 'With the divine grace of Lord Ganesha and the blessings of our ancestors, we warmly invite you to join us in celebrating the auspicious union of Aditi and Nitin.',
    },
    invitationMessageHi: {
      type: String,
      default: 'श्री गणेशाय नमः। हमारे पूर्वजों के आशीर्वाद से, हम आपको अदिति एवं नितिन के शुभ विवाह के पावन अवसर पर सपरिवार सादर आमंत्रित करते हैं।',
    },

    heroSlides: {
      type: [HeroSlideSchema],
      default: [
        {
          id: 'slide-1',
          desktopImage: '/wedding-assets/optimized/hero-main.webp',
          mobileImage: '/wedding-assets/optimized/hero-main.webp',
          title: 'Aditi & Nitin',
          subtitle: 'The Royal Wedding Celebration',
          dateBadge: 'December 11, 2026',
          order: 1,
          isActive: true,
        },
        {
          id: 'slide-2',
          desktopImage: '/wedding-assets/optimized/hero-ring.webp',
          mobileImage: '/wedding-assets/optimized/hero-ring.webp',
          title: 'Two Souls, One Destiny',
          subtitle: 'Celebrating Love, Tradition & Eternity',
          dateBadge: 'December 11, 2026',
          order: 2,
          isActive: true,
        },
      ],
    },

    storyMilestones: {
      type: [StoryMilestoneSchema],
      default: [
        {
          id: 'story-1',
          title: 'The First Spark',
          date: 'Spring 2024',
          description: 'A serendipitous introduction blossomed into hours of effortless conversation, discovering shared values, laughter, and an unspoken harmony.',
          order: 1,
        },
        {
          id: 'story-2',
          title: 'The Eternal Promise',
          date: 'Autumn 2025',
          description: 'Surrounded by the warm blessings of both families, two hearts made the sacred pledge to walk hand in hand forever.',
          order: 2,
        },
      ],
    },

    familyMembers: {
      type: [FamilyMemberSchema],
      default: [
        {
          id: 'fam-1',
          name: 'Shri KBL Srivastava & Smt. Meera Devi',
          relationship: "Bride's Loving Parents",
          side: 'BRIDE',
          description: 'Bestowing their heartfelt blessings upon the sacred union.',
          order: 1,
        },
        {
          id: 'fam-2',
          name: 'Shri Lalit Mohan Joshi & Smt. Suman Joshi',
          relationship: "Groom's Loving Parents",
          side: 'GROOM',
          description: 'Welcoming Aditi into their family with open arms and immense love.',
          order: 2,
        },
      ],
    },

    appearance: {
      primaryColor: { type: String, default: '#780016' },
      secondaryColor: { type: String, default: '#d4af37' },
      enableFloatingParticles: { type: Boolean, default: true },
      enableFlowerPetals: { type: Boolean, default: true },
      enableMusicAutoplay: { type: Boolean, default: false },
    },

    seo: {
      metaTitle: { type: String, default: 'Aditi & Nitin Royal Hindu Wedding - 11 December 2026' },
      metaDescription: {
        type: String,
        default: 'Official wedding invitation and celebration platform for Aditi Srivastava & Nitin Joshi. Gorakhpur, UP.',
      },
      ogImage: { type: String, default: '/wedding-assets/optimized/hero-main.webp' },
      keywords: {
        type: [String],
        default: ['Aditi Nitin Wedding', 'Gorakhpur Wedding', 'Indian Royal Wedding', '11 December 2026'],
      },
    },

    websiteSettings: {
      primaryPhone: { type: String, default: '+91-9876543210' },
      whatsappNumber: { type: String, default: '919876543210' },
      musicUrl: { type: String, default: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65955635.mp3' },
      isPublic: { type: Boolean, default: true },
      maintenanceMode: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const Wedding = mongoose.model<IWedding>('Wedding', WeddingSchema);
