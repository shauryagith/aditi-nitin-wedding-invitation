import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Wedding } from '../models/Wedding.js';
import { Event } from '../models/Event.js';
import { Gallery } from '../models/Gallery.js';

export const weddingController = {
  getWeddingDetails: async (req: Request, res: Response): Promise<void> => {
    try {
      if (mongoose.connection.readyState === 1) {
        const wedding = await Wedding.findOne();
        if (wedding) {
          res.json({ success: true, data: wedding });
          return;
        }
      }

      // Resilient default response if DB is initializing or offline
      res.json({
        success: true,
        data: {
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
          invitationMessage:
            'With the divine grace of Lord Ganesha and the blessings of our ancestors, we warmly invite you to celebrate the joyous wedding of Aditi and Nitin.',
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getEvents: async (req: Request, res: Response): Promise<void> => {
    try {
      if (mongoose.connection.readyState === 1) {
        const events = await Event.find().sort({ order: 1 });
        if (events && events.length > 0) {
          res.json({
            success: true,
            data: events.map((e) => ({
              id: e._id.toString(),
              _id: e._id.toString(),
              slug: e.slug,
              title: e.title,
              titleHi: e.titleHi || '',
              date: e.date,
              formattedDate: e.formattedDate || 'Friday, 11 December 2026',
              formattedDateHi: e.formattedDateHi || 'शुक्रवार, ११ दिसम्बर २०२६',
              startTime: e.startTime || null,
              endTime: e.endTime || null,
              venue: e.venue,
              venueHi: e.venueHi || '',
              address: e.address,
              addressHi: e.addressHi || '',
              description: e.description,
              descriptionHi: e.descriptionHi || '',
              image: e.image,
              publicId: e.publicId,
              dressCode: e.dressCode,
              dressCodeHi: e.dressCodeHi,
              accentColor: e.accentColor || '#D4AF37',
              badgeColor: e.badgeColor || 'bg-amber-500 text-maroon-950',
              mapUrl: e.mapUrl,
              order: e.order,
            })),
          });
          return;
        }
      }

      // Resilient default 4 ceremonies using authentic assets
      res.json({
        success: true,
        data: [
          {
            id: 'evt-haldi',
            title: 'Haldi Ceremony',
            titleHi: 'शुभ हल्दी उत्सव',
            slug: 'haldi',
            date: '2026-12-11',
            formattedDate: 'Friday, 11 December 2026',
            formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
            startTime: '10:00 AM',
            endTime: '01:00 PM',
            venue: 'Courtyard Lawn, 002E Bank Colony',
            venueHi: 'प्रांगण, ००२ई बैंक कॉलोनी, गोरखपुर',
            address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
            addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
            description: 'Auspicious yellow marigold flower showers, fresh turmeric paste blessings, traditional folk dhol beats, and joyful laughter as loved ones bless the couple.',
            descriptionHi: 'पीत वर्ण हल्दी का उबटन, गेंदे के फूलों की सुगंधित वर्षा, ढोल की थाप और परिजनों के मंगल गान के बीच पावन हल्दी संस्कार।',
            image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354450/wedding/events/haldi_ceremony.jpg',
            publicId: 'wedding/events/haldi_ceremony',
            dressCode: 'Bright Yellow / Mustard Traditional',
            accentColor: '#EAB308',
            badgeColor: 'bg-amber-500 text-maroon-950',
            mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
            order: 1,
          },
          {
            id: 'evt-mehndi',
            title: 'Mehndi Ceremony',
            titleHi: 'मेहँदी उत्सव',
            slug: 'mehndi',
            date: '2026-12-11',
            formattedDate: 'Friday, 11 December 2026',
            formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
            startTime: '02:30 PM',
            endTime: '05:30 PM',
            venue: 'Terrace Garden, 002E Bank Colony',
            venueHi: 'टेरेस गार्डन, ००२ई बैंक कॉलोनी, गोरखपुर',
            address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
            addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
            description: 'Exquisite bridal henna artistry, soothing green & golden floral decorations, traditional Indian songs, folk dances, and celebratory delicacies.',
            descriptionHi: 'हथेलियों पर रचेगी पिया के नाम की सघन मेहँदी, सुहावने गीतों की मधुर झंकार, हरी-सुनहरी सजावट और उल्लासमय उत्सव।',
            image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354456/wedding/events/mehndi_ceremony.jpg',
            publicId: 'wedding/events/mehndi_ceremony',
            dressCode: 'Emerald Green / Festive Ethnic',
            accentColor: '#166534',
            badgeColor: 'bg-emerald-700 text-white',
            mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
            order: 2,
          },
          {
            id: 'evt-tilak',
            title: 'Shubh Tilak Ceremony',
            titleHi: 'शुभ तिलक समारोह',
            slug: 'tilak',
            date: '2026-12-11',
            formattedDate: 'Friday, 11 December 2026',
            formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
            startTime: '05:30 PM',
            endTime: '07:30 PM',
            venue: 'Royal Hall, 002E Bank Colony',
            venueHi: 'रॉयल हॉल, ००२ई बैंक कॉलोनी, गोरखपुर',
            address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
            addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
            description: 'Vedic rituals with ceremonial thali, kumkum, akshat, sacred coconut, and royal traditional gifts as both families exchange sacred acceptance and respect.',
            descriptionHi: 'कुमकुम, अक्षत, नारियल और मंगल थाली से सुसज्जित वैदिक रीति द्वारा वर पक्ष का स्वागत एवं दोनों कुलों का परस्पर सम्मान व तिलक संस्कार।',
            image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354458/wedding/events/tilak_ceremony.jpg',
            publicId: 'wedding/events/tilak_ceremony',
            dressCode: 'Royal Peach / Kurta Pyjama & Sarees',
            accentColor: '#C2410C',
            badgeColor: 'bg-orange-700 text-white',
            mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
            order: 3,
          },
          {
            id: 'evt-wedding',
            title: 'Wedding Ceremony (Vivah)',
            titleHi: 'शुभ विवाह संस्कार (पाणिग्रहण)',
            slug: 'wedding',
            date: '2026-12-11',
            formattedDate: 'Friday, 11 December 2026',
            formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
            startTime: '07:30 PM',
            endTime: 'Midnight',
            venue: 'Royal Wedding Pavilion, 002E Bank Colony',
            venueHi: 'विवाह मंडप, ००२ई बैंक कॉलोनी, गोरखपुर',
            address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
            addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
            description: 'The sacred grand ceremony: Royal Baraat welcome, Jaimala garland exchange, Kanyadaan, and Saat Phere around the sacred Agni amidst Vedic chants.',
            descriptionHi: 'शाही बारात स्वागत, भव्य जयमाला, पावन अग्नि के समक्ष सप्तपदी (सात फेरे), कन्यादान और जीवनभर के लिए सिंदूर व मंगलसूत्र समर्पण।',
            image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354461/wedding/events/wedding_ceremony.jpg',
            publicId: 'wedding/events/wedding_ceremony',
            dressCode: 'Royal Burgundy, Gold & Traditional Silk',
            accentColor: '#581C2B',
            badgeColor: 'bg-maroon-800 text-gold-300 border border-gold-400',
            mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
            order: 4,
          },
        ],
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getGallery: async (req: Request, res: Response): Promise<void> => {
    try {
      if (mongoose.connection.readyState === 1) {
        const gallery = await Gallery.find({ isPublished: { $ne: false } }).sort({ order: 1, createdAt: -1 });
        if (gallery && gallery.length > 0) {
          res.json({
            success: true,
            data: gallery.map((g) => ({
              id: g._id.toString(),
              _id: g._id.toString(),
              title: g.title,
              titleHi: g.titleHi || '',
              caption: g.caption || '',
              imageUrl: g.imageUrl,
              thumbnailUrl: g.thumbnailUrl || g.imageUrl,
              publicId: g.publicId,
              category: g.category,
              categoryLabel: g.categoryLabel || g.category,
              categoryLabelHi: g.categoryLabelHi || g.category,
              order: g.order,
              isPublished: g.isPublished !== false,
            })),
          });
          return;
        }
      }

      // Resilient default curated gallery moments using authentic Cloudinary assets
      res.json({
        success: true,
        data: [
          {
            id: 'gal-couple-1',
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
            id: 'gal-couple-2',
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
            id: 'gal-couple-3',
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
            id: 'gal-prewedding-1',
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
            id: 'gal-prewedding-2',
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
            id: 'gal-prewedding-3',
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
            id: 'gal-family-1',
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
            id: 'gal-family-2',
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
            id: 'gal-family-3',
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
            id: 'gal-celebration-1',
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
            id: 'gal-celebration-2',
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
            id: 'gal-celebration-3',
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
            id: 'gal-tradition-1',
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
            id: 'gal-tradition-2',
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
            id: 'gal-tradition-3',
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
        ],
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getSyncStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      let lastUpdated = 0;
      if (mongoose.connection.readyState === 1) {
        const [latestWedding, latestEvent, latestGallery] = await Promise.all([
          Wedding.findOne().select('updatedAt').sort({ updatedAt: -1 }).lean(),
          Event.findOne().select('updatedAt').sort({ updatedAt: -1 }).lean(),
          Gallery.findOne().select('updatedAt').sort({ updatedAt: -1 }).lean(),
        ]);

        const dates: number[] = [
          latestWedding && (latestWedding as any).updatedAt ? new Date((latestWedding as any).updatedAt).getTime() : 0,
          latestEvent && (latestEvent as any).updatedAt ? new Date((latestEvent as any).updatedAt).getTime() : 0,
          latestGallery && (latestGallery as any).updatedAt ? new Date((latestGallery as any).updatedAt).getTime() : 0,
        ];
        lastUpdated = Math.max(...dates, 0);
      }
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.json({ success: true, lastUpdated, serverTime: Date.now() });
    } catch (error: any) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.json({ success: true, lastUpdated: Date.now(), serverTime: Date.now() });
    }
  },
};
