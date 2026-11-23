import express, { Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import QRCodePackage from 'qrcode';

import { ENV, validateStorageConfig } from './config/env.js';
import { connectDB } from './config/db.js';
import { Admin } from './models/Admin.js';
import { Event } from './models/Event.js';
import { Wedding } from './models/Wedding.js';
import { MusicTrack } from './models/MusicTrack.js';
import { QRCode } from './models/QRCode.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSocketIO } from './socket/index.js';

import authRoutes from './routes/authRoutes.js';
import weddingRoutes from './routes/weddingRoutes.js';
import rsvpRoutes from './routes/rsvpRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();

// Security & Parsing Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://aditi-nitin-wedding-invitation.vercel.app',
  'https://aditinitinwedding.com',
  'https://www.aditinitinwedding.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else if (ENV.NODE_ENV === 'production') {
        callback(new Error('Blocked by CORS policy'));
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(cookieParser(ENV.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Aditi & Nitin Royal Wedding Invitation API',
    weddingDate: '2026-12-11T19:00:00+05:30',
    storageProvider: ENV.STORAGE_PROVIDER,
  });
});

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api', weddingRoutes);
app.use('/api', rsvpRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Database Seeder
export async function seedInitialData() {
  try {
    // 1. Seed Admin if not exists
    const adminExists = await Admin.findOne({ email: ENV.ADMIN_DEFAULT_EMAIL.toLowerCase() });
    if (!adminExists) {
      const passwordHash = await bcrypt.hash(ENV.ADMIN_DEFAULT_PASSWORD, 10);
      await Admin.create({
        name: ENV.ADMIN_DEFAULT_NAME,
        email: ENV.ADMIN_DEFAULT_EMAIL.toLowerCase(),
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      });
      console.log(`[Seed] Initial Admin seeded: ${ENV.ADMIN_DEFAULT_EMAIL}`);
    }

    // 2. Seed Master Wedding Record if not exists or if date needs correction
    let weddingRecord = await Wedding.findOne();
    if (!weddingRecord) {
      weddingRecord = await Wedding.create({
        brideName: 'Aditi',
        brideNameHi: 'अदिति',
        brideMother: 'Smt. Meera Devi',
        brideFather: 'Shri KBL Srivastava',
        groomName: 'Nitin',
        groomNameHi: 'नितिन',
        groomMother: 'Smt. Suman',
        groomFather: 'Shri Lalit Mohan Joshi',
        weddingDate: '2026-12-11T19:00:00+05:30',
        timezone: 'Asia/Kolkata',
        venue: 'Srivastava Niwas',
        address: '002E Bank Colony, Padari Bazaar, Gorakhpur, UP 273014, India',
        mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
      });
      console.log('[Seed] Wedding master configuration record seeded with date: 2026-12-11');
    } else if (weddingRecord.weddingDate.includes('2026-12-12')) {
      weddingRecord.weddingDate = '2026-12-11T19:00:00+05:30';
      await weddingRecord.save();
      console.log('[Seed] Corrected wedding date in database to 2026-12-11T19:00:00+05:30');
    }

    // 2b. Seed / Repair Our Story Milestones with published website content
    if (!weddingRecord.storyMilestones || weddingRecord.storyMilestones.length < 4 || !weddingRecord.storyMilestones[0].image) {
      weddingRecord.storyMilestones = [
        {
          id: 'story-1',
          title: 'When Two Souls First Met',
          titleHi: 'जब दो राहें एक हुईं',
          date: 'Autumn 2024',
          dateStr: 'Autumn 2024',
          dateStrHi: 'शरद २०२४',
          description: 'A serene afternoon introduction that sparked hours of unhurried conversation. From shared aspirations to fond childhood memories, time slipped away effortlessly.',
          descriptionHi: 'एक शांत दोपहर की पहली औपचारिक मुलाक़ात, जो घंटों की आत्मीय बातचीत में बदल गई। विचारों की सहजता और प्राथमिकताओं का ऐसा सामंजस्य, जैसे दो रूहें वर्षों से परिचित हों।',
          image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363478/wedding/story/hjwfaiizwy73qgyyeezy.jpg',
          publicId: 'wedding/story/story_chapter_1_first_meeting',
          quote: 'In the quietest moments, destiny finds its gentle rhythm.',
          quoteHi: 'जहाँ शब्दों से परे, भावनाएँ अपनी पवित्रता में संवाद करती हैं।',
        },
        {
          id: 'story-2',
          title: 'Conversations That Blossomed',
          titleHi: 'बातचीत जो अनुराग बन गई',
          date: 'Spring 2025',
          dateStr: 'Spring 2025',
          dateStrHi: 'वसंत २०२५',
          description: 'Morning tea chats turned into shared dreams, mutual encouragement, and understanding each other with gentle respect and warmth.',
          descriptionHi: 'एक-दूसरे के सपनों का सम्मान, जीवन के हर पहलू पर खुलकर विचार और परिवार के प्रति साझा निष्ठा ने इस रिश्ते को दृढ़ और प्रगाढ़ बना दिया।',
          image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363480/wedding/story/epbzvyjmdvhtf8cxcaaw.jpg',
          publicId: 'wedding/story/story_chapter_2_conversations',
          quote: 'Love is not just finding someone you can live with; it is finding someone you cannot live without.',
          quoteHi: 'सच्चा प्रेम केवल साथ रहना नहीं, बल्कि एक दूसरे का संबल बनना है।',
        },
        {
          id: 'story-3',
          title: 'Families United in Joy (Roka & Blessings)',
          titleHi: 'दो परिवारों का स्नेहिल मिलन (रोका)',
          date: 'Monsoon 2025',
          dateStr: 'Monsoon 2025',
          dateStrHi: 'मानसून २०२५',
          description: 'With traditional sweets, Vedic chants, and tears of joy, both parents embraced each other, sanctifying the promise of a lifetime.',
          descriptionHi: 'मिठाइयों की मिठास, वैदिक श्लोक और परिजनों के अश्रुपूरित आशीर्वाद के साथ दोनों परिवारों ने एक होकर इस पवित्र बंधन पर अपनी मुहर लगाई।',
          image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363483/wedding/story/md76oridvd2hc8uvc34v.jpg',
          publicId: 'wedding/story/story_chapter_3_families_united',
          quote: 'Two families, bound by culture, heritage, and pure affection.',
          quoteHi: 'संस्कारों का संगम और दो कुलों का मंगलकारी एकीकरण।',
        },
        {
          id: 'story-4',
          title: 'The Sacred Vow Ahead',
          titleHi: 'सप्तपदी और अनंत समर्पण',
          date: '11 December 2026',
          dateStr: '11 December 2026',
          dateStrHi: '११ दिसम्बर २०२६',
          description: 'Walking hand in hand around the sacred Agni, taking seven timeless vows of partnership, loyalty, and boundless affection.',
          descriptionHi: 'पवित्र अग्नि के समक्ष सात फेरे लेकर, जीवन की हर धूप-छाँव में एक दूसरे का हाथ थामे रहने का पावन संकल्प।',
          image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363486/wedding/story/hzylphh0u3vle6jg6hnm.jpg',
          publicId: 'wedding/story/story_chapter_4_sacred_vows',
          quote: 'Walking together towards eternity, hand in hand.',
          quoteHi: 'जीवन की नई यात्रा का शुभारंभ, आपके आशीषों के साथ।',
        },
      ] as any;
      await weddingRecord.save();
      console.log('[Seed] Seeded 4 authentic Our Story milestones with Cloudinary images');
    }

    // 2c. Seed / Repair Hero Slides with authentic Cloudinary images & local fallbacks
    if (
      !weddingRecord.heroSlides ||
      weddingRecord.heroSlides.length < 4 ||
      weddingRecord.heroSlides.some(
        (s: any) => !s.desktopImage || s.desktopImage.includes('/wedding-assets/optimized/')
      )
    ) {
      weddingRecord.heroSlides = [
        {
          id: 'slide-1',
          desktopImage:
            'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354463/wedding/gallery/gal_couple_1_sunset_palace.jpg',
          mobileImage:
            'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,w_800,h_1200,q_auto/v1/wedding/gallery/gal_couple_1_sunset_palace.webp',
          title: 'Aditi & Nitin',
          subtitle: 'The Royal Wedding Celebration',
          dateBadge: 'December 11, 2026',
          order: 1,
          isActive: true,
        },
        {
          id: 'slide-2',
          desktopImage:
            'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354461/wedding/events/wedding_ceremony.jpg',
          mobileImage:
            'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,w_800,h_1200,q_auto/v1/wedding/events/wedding_ceremony.webp',
          title: 'Two Families, One Beautiful Celebration',
          subtitle: 'Join us in celebrating love and togetherness.',
          dateBadge: 'December 11, 2026',
          order: 2,
          isActive: true,
        },
        {
          id: 'slide-3',
          desktopImage:
            'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354484/wedding/gallery/gal_celebration_1_baraat_procession.jpg',
          mobileImage:
            'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,w_800,h_1200,q_auto/v1/wedding/gallery/gal_celebration_1_baraat_procession.webp',
          title: 'A Celebration of Traditions',
          subtitle: 'Haldi | Mehndi | Tilak | Wedding',
          dateBadge: 'December 11, 2026',
          order: 3,
          isActive: true,
        },
        {
          id: 'slide-4',
          desktopImage:
            'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354465/wedding/gallery/gal_couple_2_carved_arches.jpg',
          mobileImage:
            'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,w_800,h_1200,q_auto/v1/wedding/gallery/gal_couple_2_carved_arches.webp',
          title: 'Your Presence Is Our Blessing',
          subtitle: 'We cordially invite you to celebrate with us.',
          dateBadge: 'December 11, 2026',
          order: 4,
          isActive: true,
        },
      ] as any;
      await weddingRecord.save();
      console.log('[Seed] 4 authentic Hero slides seeded and repaired with Cloudinary images');
    }

    // 3. Seed / Repair Wedding Events with verified Cloudinary images
    const brokenEvents = await Event.find({ image: { $regex: '/wedding-assets/optimized/' } });
    if (brokenEvents.length > 0) {
      console.log(`[Seed] Repairing ${brokenEvents.length} events with verified Cloudinary secure URLs...`);
      const eventUrls: Record<string, string> = {
        'haldi-ceremony': 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354450/wedding/events/haldi_ceremony.jpg',
        'haldi': 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354450/wedding/events/haldi_ceremony.jpg',
        'mehndi-sangeet': 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354456/wedding/events/mehndi_ceremony.jpg',
        'mehndi': 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354456/wedding/events/mehndi_ceremony.jpg',
        'tilak-sagai': 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354458/wedding/events/tilak_ceremony.jpg',
        'tilak': 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354458/wedding/events/tilak_ceremony.jpg',
        'shubh-vivah': 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354461/wedding/events/wedding_ceremony.jpg',
        'wedding': 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354461/wedding/events/wedding_ceremony.jpg',
      };
      for (const ev of brokenEvents) {
        if (eventUrls[ev.slug]) {
          ev.image = eventUrls[ev.slug];
          await ev.save();
        }
      }
    }

    const eventsCount = await Event.countDocuments();
    if (eventsCount === 0) {
      await Event.create([
        {
          title: 'Haldi Ceremony',
          titleHi: 'शुभ हल्दी उत्सव',
          slug: 'haldi',
          description: 'A radiant morning of auspicious turmeric paste application, joyous songs, and vibrant yellow attire.',
          descriptionHi: 'शुभ हल्दी लेपन एवं मंगल गीतों का उल्लासमय प्रातःकालीन कार्यक्रम।',
          date: '2026-12-11',
          formattedDate: 'Friday, 11 December 2026',
          formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
          startTime: '10:00 AM',
          endTime: '01:00 PM',
          venue: 'Courtyard Lawn, 002E Bank Colony',
          venueHi: 'प्रांगण, ००२ई बैंक कॉलोनी, गोरखपुर',
          address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
          addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
          image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354450/wedding/events/haldi_ceremony.jpg',
          publicId: 'wedding/events/haldi_ceremony',
          dressCode: 'Bright Yellow / Mustard Traditional',
          dressCodeHi: 'पीला / सरसों पारंपरिक परिधान',
          accentColor: '#EAB308',
          badgeColor: 'bg-amber-500 text-maroon-950',
          mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
          order: 1,
        },
        {
          title: 'Mehndi Ceremony',
          titleHi: 'मेहँदी उत्सव',
          slug: 'mehndi',
          description: 'Intricate henna adornments, folk music, celebratory dances, and sweet festivities.',
          descriptionHi: 'कलात्मक मेहंदी, मधुर संगीत एवं सपरिवार संगीतमय उत्सव।',
          date: '2026-12-11',
          formattedDate: 'Friday, 11 December 2026',
          formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
          startTime: '02:30 PM',
          endTime: '05:30 PM',
          venue: 'Terrace Garden, 002E Bank Colony',
          venueHi: 'टेरेस गार्डन, ००२ई बैंक कॉलोनी, गोरखपुर',
          address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
          addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
          image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354456/wedding/events/mehndi_ceremony.jpg',
          publicId: 'wedding/events/mehndi_ceremony',
          dressCode: 'Emerald Green / Festive Ethnic',
          dressCodeHi: 'हरा / उत्सव परिधान',
          accentColor: '#166534',
          badgeColor: 'bg-emerald-700 text-white',
          mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
          order: 2,
        },
        {
          title: 'Shubh Tilak Ceremony',
          titleHi: 'शुभ तिलक समारोह',
          slug: 'tilak',
          description: 'Traditional welcoming ceremony with auspicious vermilion, exchanging sacred rings, and family blessings.',
          descriptionHi: 'पारंपरिक तिलक, पावन अंगूठी समारोह एवं बड़े-बुजुर्गों का शुभाशीर्वाद।',
          date: '2026-12-11',
          formattedDate: 'Friday, 11 December 2026',
          formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
          startTime: '05:30 PM',
          endTime: '07:30 PM',
          venue: 'Royal Hall, 002E Bank Colony',
          venueHi: 'रॉयल हॉल, ००२ई बैंक कॉलोनी, गोरखपुर',
          address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
          addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
          image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354458/wedding/events/tilak_ceremony.jpg',
          publicId: 'wedding/events/tilak_ceremony',
          dressCode: 'Royal Peach / Kurta Pyjama & Sarees',
          dressCodeHi: 'रॉयल पीच / कुर्ता-पायजामा एवं साड़ी',
          accentColor: '#C2410C',
          badgeColor: 'bg-orange-700 text-white',
          mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
          order: 3,
        },
        {
          title: 'Wedding Ceremony (Vivah)',
          titleHi: 'शुभ विवाह संस्कार (पाणिग्रहण)',
          slug: 'wedding',
          description: 'The sacred Hindu wedding rituals: Baraat arrival, Varmala, Kanyadaan, and the holy Saptapadi around the sacred Agni.',
          descriptionHi: 'बारात स्वागत, वरमाला, कन्यादान एवं अग्नि साक्षी में सात फेरे।',
          date: '2026-12-11',
          formattedDate: 'Friday, 11 December 2026',
          formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
          startTime: '07:30 PM',
          endTime: 'Midnight',
          venue: 'Royal Wedding Pavilion, 002E Bank Colony',
          venueHi: 'विवाह मंडप, ००२ई बैंक कॉलोनी, गोरखपुर',
          address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
          addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
          image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354461/wedding/events/wedding_ceremony.jpg',
          publicId: 'wedding/events/wedding_ceremony',
          dressCode: 'Royal Burgundy, Gold & Traditional Silk',
          dressCodeHi: 'शाही महरून, सुनहरा एवं रेशमी परिधान',
          accentColor: '#581C2B',
          badgeColor: 'bg-maroon-800 text-gold-300 border border-gold-400',
          mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
          order: 4,
        },
      ]);
      console.log('[Seed] Default 4 wedding events seeded with verified Cloudinary images');
    }

    // 3.5 Seed Default Gallery Photos if none exist
    const { Gallery } = await import('./models/Gallery.js');
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.create([
        {
          title: 'Royal Couple at Sunset Palace',
          titleHi: 'शाही महल में वर-वधू',
          caption: 'Aditi and Nitin in regal crimson lehenga and cream sherwani framed by majestic palace arches.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354463/wedding/gallery/gal_couple_1_sunset_palace.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_couple_1_sunset_palace.webp',
          publicId: 'wedding/gallery/gal_couple_1_sunset_palace',
          category: 'aditi-nitin',
          categoryLabel: 'Aditi & Nitin',
          categoryLabelHi: 'अदिति एवं नितिन',
          order: 1,
          isPublished: true,
        },
        {
          title: 'Regal Elegance under Carved Arches',
          titleHi: 'नक्काशीदार मेहराबों तले राजसी आभा',
          caption: 'Standing together in timeless grace, sharing promises of eternity.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354465/wedding/gallery/gal_couple_2_carved_arches.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_couple_2_carved_arches.webp',
          publicId: 'wedding/gallery/gal_couple_2_carved_arches',
          category: 'aditi-nitin',
          categoryLabel: 'Aditi & Nitin',
          categoryLabelHi: 'अदिति एवं नितिन',
          order: 2,
          isPublished: true,
        },
        {
          title: 'Bride Aditi on Floral Swing',
          titleHi: 'पुष्प झूले पर दुल्हन अदिति',
          caption: 'Elegance and joy adorned with fragrant jasmine and marigold blooms.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354471/wedding/gallery/gal_couple_3_floral_swing.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_couple_3_floral_swing.webp',
          publicId: 'wedding/gallery/gal_couple_3_floral_swing',
          category: 'aditi-nitin',
          categoryLabel: 'Aditi & Nitin',
          categoryLabelHi: 'अदिति एवं नितिन',
          order: 3,
          isPublished: true,
        },
        {
          title: 'Garden Romance at Dusk',
          titleHi: 'उद्यान में स्वर्णिम संध्या',
          caption: 'A tender twilight stroll through heritage palace gardens.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354472/wedding/gallery/gal_prewedding_1_garden_romance.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_prewedding_1_garden_romance.webp',
          publicId: 'wedding/gallery/gal_prewedding_1_garden_romance',
          category: 'pre-wedding',
          categoryLabel: 'Pre-Wedding',
          categoryLabelHi: 'प्री-वेडिंग',
          order: 4,
          isPublished: true,
        },
        {
          title: 'Sangeet Celebration Dance',
          titleHi: 'संगीत उत्सव का उल्लासमय नृत्य',
          caption: 'Rhythms of joy, glittering royal blue attire, and heartfelt laughter.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354474/wedding/gallery/gal_prewedding_2_sangeet_dance.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_prewedding_2_sangeet_dance.webp',
          publicId: 'wedding/gallery/gal_prewedding_2_sangeet_dance',
          category: 'pre-wedding',
          categoryLabel: 'Pre-Wedding',
          categoryLabelHi: 'प्री-वेडिंग',
          order: 5,
          isPublished: true,
        },
        {
          title: 'Festive Musical Night',
          titleHi: 'उत्सवमयी संगीतमय रात्रि',
          caption: 'Under fairy lights and royal chandeliers, celebrating timeless love.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354477/wedding/gallery/gal_prewedding_3_musical_night.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_prewedding_3_musical_night.webp',
          publicId: 'wedding/gallery/gal_prewedding_3_musical_night',
          category: 'pre-wedding',
          categoryLabel: 'Pre-Wedding',
          categoryLabelHi: 'प्री-वेडिंग',
          order: 6,
          isPublished: true,
        },
        {
          title: 'Heritage Family Courtyard Banquet',
          titleHi: 'आँगन में पारिवारिक प्रीतिभोज',
          caption: 'Multi-generational warmth and shared memories in the haveli courtyard.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354478/wedding/gallery/gal_family_1_courtyard_banquet.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_family_1_courtyard_banquet.webp',
          publicId: 'wedding/gallery/gal_family_1_courtyard_banquet',
          category: 'family-moments',
          categoryLabel: 'Family Moments',
          categoryLabelHi: 'पारिवारिक क्षण',
          order: 7,
          isPublished: true,
        },
        {
          title: "Elders' Marigold Petal Shower",
          titleHi: 'बुजुर्गों का अक्षत व पुष्प वर्षा आशीर्वाद',
          caption: 'Cherished blessings showered upon the couple by loving parents and elders.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354480/wedding/gallery/gal_family_2_petal_shower.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_family_2_petal_shower.webp',
          publicId: 'wedding/gallery/gal_family_2_petal_shower',
          category: 'family-moments',
          categoryLabel: 'Family Moments',
          categoryLabelHi: 'पारिवारिक क्षण',
          order: 8,
          isPublished: true,
        },
        {
          title: 'Two Families United in Blessings',
          titleHi: 'दो कुलों का पावन मिलन',
          caption: 'Srivastava and Joshi families exchanging sweets, auspicious gifts, and affection.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354483/wedding/gallery/gal_family_3_families_united.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_family_3_families_united.webp',
          publicId: 'wedding/gallery/gal_family_3_families_united',
          category: 'family-moments',
          categoryLabel: 'Family Moments',
          categoryLabelHi: 'पारिवारिक क्षण',
          order: 9,
          isPublished: true,
        },
        {
          title: 'Grand Baraat Procession',
          titleHi: 'शाही बारात एवं भव्य स्वागत',
          caption: 'Celebratory dhol rhythms, dancing family, and groom Nitin arrival.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354484/wedding/gallery/gal_celebration_1_baraat_procession.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_celebration_1_baraat_procession.webp',
          publicId: 'wedding/gallery/gal_celebration_1_baraat_procession',
          category: 'wedding-celebrations',
          categoryLabel: 'Wedding Celebrations',
          categoryLabelHi: 'विवाह उत्सव',
          order: 10,
          isPublished: true,
        },
        {
          title: 'The Sacred Varmala Ceremony',
          titleHi: 'वरमाला का पावन क्षण',
          caption: 'Exchanging fragrant floral garlands atop the elevated royal stage.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354491/wedding/gallery/gal_celebration_2_varmala_ceremony.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_celebration_2_varmala_ceremony.webp',
          publicId: 'wedding/gallery/gal_celebration_2_varmala_ceremony',
          category: 'wedding-celebrations',
          categoryLabel: 'Wedding Celebrations',
          categoryLabelHi: 'विवाह उत्सव',
          order: 11,
          isPublished: true,
        },
        {
          title: 'Royal Courtyard Illumination',
          titleHi: 'विवाह स्थल का अलौकिक प्रकाश',
          caption: 'Brass urlis, floating diyas, and marigold canopies lighting up the night.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354494/wedding/gallery/gal_celebration_3_courtyard_illumination.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_celebration_3_courtyard_illumination.webp',
          publicId: 'wedding/gallery/gal_celebration_3_courtyard_illumination',
          category: 'wedding-celebrations',
          categoryLabel: 'Wedding Celebrations',
          categoryLabelHi: 'विवाह उत्सव',
          order: 12,
          isPublished: true,
        },
        {
          title: 'Auspicious Haldi Turmeric Blessing',
          titleHi: 'शुभ हल्दी लेपन संस्कार',
          caption: 'Golden glow of turmeric applied with love and Vedic prayers.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354496/wedding/gallery/gal_tradition_1_haldi_blessing.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_tradition_1_haldi_blessing.webp',
          publicId: 'wedding/gallery/gal_tradition_1_haldi_blessing',
          category: 'wedding-traditions',
          categoryLabel: 'Wedding Traditions',
          categoryLabelHi: 'वैदिक संस्कार',
          order: 13,
          isPublished: true,
        },
        {
          title: 'Intricate Bridal Henna Artwork',
          titleHi: 'अदिति की सघन मेहँदी कला',
          caption: 'Detailed bridal mehndi gracing hands with peacock and floral motifs.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354499/wedding/gallery/gal_tradition_2_bridal_henna.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_tradition_2_bridal_henna.webp',
          publicId: 'wedding/gallery/gal_tradition_2_bridal_henna',
          category: 'wedding-traditions',
          categoryLabel: 'Wedding Traditions',
          categoryLabelHi: 'वैदिक संस्कार',
          order: 14,
          isPublished: true,
        },
        {
          title: 'Sacred Hastamelap & Seven Vows',
          titleHi: 'हस्तमिलाप एवं सप्तपदी',
          caption: 'Hands united with sacred kusha grass and holy thread around the sacred Agni.',
          imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354500/wedding/gallery/gal_tradition_3_hastamelap_vows.jpg',
          thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_tradition_3_hastamelap_vows.webp',
          publicId: 'wedding/gallery/gal_tradition_3_hastamelap_vows',
          category: 'wedding-traditions',
          categoryLabel: 'Wedding Traditions',
          categoryLabelHi: 'वैदिक संस्कार',
          order: 15,
          isPublished: true,
        },
      ]);
      console.log('[Seed] Default 15 gallery photos seeded with verified Cloudinary images');
    }

    // 4. Seed Default Music Track if none exists
    const musicCount = await MusicTrack.countDocuments();
    if (musicCount === 0) {
      await MusicTrack.create({
        title: 'Royal Shehnai & Sitar Melody',
        artist: 'Traditional Indian Wedding Maestro',
        fileUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65955635.mp3',
        originalName: 'shehnai_sitar_melody.mp3',
        duration: 180,
        isActive: true,
        isDefault: true,
        volume: 0.5,
        loop: true,
        order: 1,
      });
      console.log('[Seed] Default background music track seeded');
    }

    // 5. Seed Real Scannable QR Codes if none exist
    const qrCount = await QRCode.countDocuments();
    if (qrCount === 0) {
      const qrSeeds = [
        {
          title: 'Wedding Invitation Website',
          type: 'INVITATION' as const,
          destinationUrl: 'https://aditinitinwedding.com/',
        },
        {
          title: 'Gorakhpur Venue Location',
          type: 'VENUE' as const,
          destinationUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
        },
        {
          title: 'RSVP Submission Form',
          type: 'RSVP' as const,
          destinationUrl: 'https://aditinitinwedding.com/#rsvp',
        },
        {
          title: 'WhatsApp Wedding Helpline',
          type: 'WHATSAPP' as const,
          destinationUrl:
            'https://wa.me/919876543210?text=Namaste!%20I%20have%20a%20query%20regarding%20Aditi%20%26%20Nitin%27s%20wedding',
        },
      ];

      for (const item of qrSeeds) {
        const qrDataUrl = await QRCodePackage.toDataURL(item.destinationUrl, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          margin: 2,
          width: 600,
          color: { dark: '#780016', light: '#ffffff' },
        });

        const svgContent = await QRCodePackage.toString(item.destinationUrl, {
          type: 'svg',
          margin: 2,
          color: { dark: '#780016', light: '#ffffff' },
        });

        await QRCode.create({
          title: item.title,
          type: item.type,
          destinationUrl: item.destinationUrl,
          qrDataUrl,
          svgContent,
          darkColor: '#780016',
          lightColor: '#ffffff',
          verifiedPayload: item.destinationUrl,
          isActive: true,
        });
      }
      console.log('[Seed] 4 Scannable QR Codes generated and seeded');
    }
  } catch (err: any) {
    console.warn('[Seed Warning]:', err.message);
  }
}

// Bootstrap Server
export const startServer = async () => {
  const storageStatus = validateStorageConfig();
  console.log(`✨ [Storage] Active provider: ${storageStatus.provider.toUpperCase()}`);
  if (storageStatus.warning) {
    console.warn(`⚠️ [Storage Warning] ${storageStatus.warning}`);
  }

  await connectDB();
  await seedInitialData();

  const httpServer = createServer(app);
  const io = initSocketIO(httpServer);

  const server = httpServer.listen(ENV.PORT, '0.0.0.0', () => {
    console.log(`✨ [Server] Aditi & Nitin Wedding Backend running on http://0.0.0.0:${ENV.PORT}`);
    console.log(`✨ [Server] Environment: ${ENV.NODE_ENV}`);
    console.log(`✨ [Server] Media Storage Provider: ${storageStatus.provider}`);
    console.log(`✨ [Socket.IO] Real-time engine attached and listening on port ${ENV.PORT}`);
  });

  return server;
};

// Auto-start unless running under test runner
if (process.env.NODE_ENV !== 'test' && process.env.VITEST !== 'true') {
  startServer();
}

export default app;
