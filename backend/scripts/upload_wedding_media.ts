import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../src/config/env.js';
import { Event } from '../src/models/Event.js';
import { Gallery } from '../src/models/Gallery.js';
import { MediaAsset } from '../src/models/MediaAsset.js';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true,
});

const rootDir = path.resolve(process.cwd());

async function uploadFileToCloudinary(
  localPath: string,
  publicId: string,
  folder: string,
  tags: string[] = []
): Promise<{ secureUrl: string; thumbnailUrl: string; publicId: string; width: number; height: number; format: string; bytes: number }> {
  const fullPath = path.isAbsolute(localPath) ? localPath : path.resolve(rootDir, localPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  const result = await cloudinary.uploader.upload(fullPath, {
    public_id: publicId.split('/').pop(),
    folder,
    resource_type: 'image',
    overwrite: true,
    tags: ['wedding', 'aditi-nitin', ...tags],
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  });

  const thumbnailUrl = cloudinary.url(result.public_id, {
    secure: true,
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'auto',
    format: 'webp',
    quality: 'auto',
  });

  return {
    secureUrl: result.secure_url,
    thumbnailUrl,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(ENV.MONGODB_URI);
  console.log('Connected to MongoDB.');

  // ================= 1. EVENT CEREMONIES =================
  console.log('\n--- Processing 4 Wedding Event Ceremonies ---');
  const eventConfigs = [
    {
      slug: 'haldi',
      title: 'Haldi Ceremony',
      titleHi: 'शुभ हल्दी उत्सव',
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
      dressCode: 'Bright Yellow / Mustard Traditional',
      dressCodeHi: 'पीला / सरसों पारंपरिक परिधान',
      accentColor: '#EAB308',
      badgeColor: 'bg-amber-500 text-maroon-950',
      mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
      order: 1,
      filePath: 'frontend/public/assets/wedding/haldi/haldi-ceremony.webp',
      publicId: 'haldi_ceremony',
      folder: 'wedding/events',
    },
    {
      slug: 'mehndi',
      title: 'Mehndi Ceremony',
      titleHi: 'मेहँदी उत्सव',
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
      dressCode: 'Emerald Green / Festive Ethnic',
      dressCodeHi: 'हरा / उत्सव परिधान',
      accentColor: '#166534',
      badgeColor: 'bg-emerald-700 text-white',
      mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
      order: 2,
      filePath: 'frontend/public/assets/wedding/mehndi/mehndi-ceremony.webp',
      publicId: 'mehndi_ceremony',
      folder: 'wedding/events',
    },
    {
      slug: 'tilak',
      title: 'Shubh Tilak Ceremony',
      titleHi: 'शुभ तिलक समारोह',
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
      dressCode: 'Royal Peach / Kurta Pyjama & Sarees',
      dressCodeHi: 'रॉयल पीच / कुर्ता-पायजामा एवं साड़ी',
      accentColor: '#C2410C',
      badgeColor: 'bg-orange-700 text-white',
      mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
      order: 3,
      filePath: 'frontend/public/assets/wedding/tilak/tilak-ceremony.webp',
      publicId: 'tilak_ceremony',
      folder: 'wedding/events',
    },
    {
      slug: 'wedding',
      title: 'Wedding Ceremony (Vivah)',
      titleHi: 'शुभ विवाह संस्कार (पाणिग्रहण)',
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
      dressCode: 'Royal Burgundy, Gold & Traditional Silk',
      dressCodeHi: 'शाही महरून, सुनहरा एवं रेशमी परिधान',
      accentColor: '#581C2B',
      badgeColor: 'bg-maroon-800 text-gold-300 border border-gold-400',
      mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
      order: 4,
      filePath: 'frontend/public/assets/wedding/wedding/wedding-ceremony.webp',
      publicId: 'wedding_ceremony',
      folder: 'wedding/events',
    },
  ];

  // Remove stale events to rebuild with clean data
  await Event.deleteMany({});

  for (const cfg of eventConfigs) {
    console.log(`Uploading Event Image: ${cfg.title} (${cfg.filePath})...`);
    const cld = await uploadFileToCloudinary(cfg.filePath, cfg.publicId, cfg.folder, ['events', cfg.slug]);
    console.log(`  Uploaded: ${cld.secureUrl}`);

    const eventDoc = await Event.create({
      title: cfg.title,
      titleHi: cfg.titleHi,
      slug: cfg.slug,
      description: cfg.description,
      descriptionHi: cfg.descriptionHi,
      date: cfg.date,
      formattedDate: cfg.formattedDate,
      formattedDateHi: cfg.formattedDateHi,
      startTime: cfg.startTime,
      endTime: cfg.endTime,
      venue: cfg.venue,
      venueHi: cfg.venueHi,
      address: cfg.address,
      addressHi: cfg.addressHi,
      image: cld.secureUrl,
      publicId: cld.publicId,
      dressCode: cfg.dressCode,
      dressCodeHi: cfg.dressCodeHi,
      accentColor: cfg.accentColor,
      badgeColor: cfg.badgeColor,
      mapUrl: cfg.mapUrl,
      order: cfg.order,
    });

    // Save into MediaAsset as well
    await MediaAsset.findOneAndUpdate(
      { publicId: cld.publicId },
      {
        filename: `${cfg.publicId}.${cld.format}`,
        originalName: path.basename(cfg.filePath),
        mimeType: `image/${cld.format}`,
        size: cld.bytes,
        width: cld.width,
        height: cld.height,
        url: cld.secureUrl,
        secureUrl: cld.secureUrl,
        thumbnailUrl: cld.thumbnailUrl,
        publicId: cld.publicId,
        storageProvider: 'cloudinary',
        folder: cfg.folder,
        format: cld.format,
        resourceType: 'image',
        category: cfg.slug,
        sectionPlacement: 'events',
        altText: `${cfg.title} - Aditi & Nitin Royal Wedding`,
        caption: cfg.title,
        order: cfg.order,
      },
      { upsert: true }
    );

    console.log(`  Event created: ${eventDoc.title} -> ${eventDoc.image}`);
  }

  // ================= 2. GALLERY MOMENTS =================
  console.log('\n--- Processing 15 Curated Gallery Photos ---');
  const galleryConfigs = [
    // 1. Aditi & Nitin
    {
      title: 'Royal Couple at Sunset Palace',
      titleHi: 'शाही महल में वर-वधू',
      caption: 'Aditi and Nitin in regal crimson lehenga and cream sherwani framed by majestic palace arches.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_b3ymbrb3ymbrb3ym.webp',
      category: 'aditi-nitin',
      categoryLabel: 'Aditi & Nitin',
      categoryLabelHi: 'अदिति एवं नितिन',
      publicId: 'gal_couple_1_sunset_palace',
      order: 1,
    },
    {
      title: 'Regal Elegance under Carved Arches',
      titleHi: 'नक्काशीदार मेहराबों तले राजसी आभा',
      caption: 'Standing together in timeless grace, sharing promises of eternity.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_mtk13zmtk13zmtk1 (4).webp',
      category: 'aditi-nitin',
      categoryLabel: 'Aditi & Nitin',
      categoryLabelHi: 'अदिति एवं नितिन',
      publicId: 'gal_couple_2_carved_arches',
      order: 2,
    },
    {
      title: 'Bride Aditi on Floral Swing',
      titleHi: 'पुष्प झूले पर दुल्हन अदिति',
      caption: 'Elegance and joy adorned with fragrant jasmine and marigold blooms.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (6).webp',
      category: 'aditi-nitin',
      categoryLabel: 'Aditi & Nitin',
      categoryLabelHi: 'अदिति एवं नितिन',
      publicId: 'gal_couple_3_floral_swing',
      order: 3,
    },

    // 2. Pre-Wedding
    {
      title: 'Garden Romance at Dusk',
      titleHi: 'उद्यान में स्वर्णिम संध्या',
      caption: 'A tender twilight stroll through heritage palace gardens.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (8).webp',
      category: 'pre-wedding',
      categoryLabel: 'Pre-Wedding',
      categoryLabelHi: 'प्री-वेडिंग',
      publicId: 'gal_prewedding_1_garden_romance',
      order: 4,
    },
    {
      title: 'Sangeet Celebration Dance',
      titleHi: 'संगीत उत्सव का उल्लासमय नृत्य',
      caption: 'Rhythms of joy, glittering royal blue attire, and heartfelt laughter.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_vgpktmvgpktmvgpk (5).webp',
      category: 'pre-wedding',
      categoryLabel: 'Pre-Wedding',
      categoryLabelHi: 'प्री-वेडिंग',
      publicId: 'gal_prewedding_2_sangeet_dance',
      order: 5,
    },
    {
      title: 'Festive Musical Night',
      titleHi: 'उत्सवमयी संगीतमय रात्रि',
      caption: 'Under fairy lights and royal chandeliers, celebrating timeless love.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_y1x1dny1x1dny1x1 (3).webp',
      category: 'pre-wedding',
      categoryLabel: 'Pre-Wedding',
      categoryLabelHi: 'प्री-वेडिंग',
      publicId: 'gal_prewedding_3_musical_night',
      order: 6,
    },

    // 3. Family Moments
    {
      title: 'Heritage Family Courtyard Banquet',
      titleHi: 'आँगन में पारिवारिक प्रीतिभोज',
      caption: 'Multi-generational warmth and shared memories in the haveli courtyard.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_6rsl0g6rsl0g6rsl.webp',
      category: 'family-moments',
      categoryLabel: 'Family Moments',
      categoryLabelHi: 'पारिवारिक क्षण',
      publicId: 'gal_family_1_courtyard_banquet',
      order: 7,
    },
    {
      title: "Elders' Marigold Petal Shower",
      titleHi: 'बुजुर्गों का अक्षत व पुष्प वर्षा आशीर्वाद',
      caption: 'Cherished blessings showered upon the couple by loving parents and elders.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (10).webp',
      category: 'family-moments',
      categoryLabel: 'Family Moments',
      categoryLabelHi: 'पारिवारिक क्षण',
      publicId: 'gal_family_2_petal_shower',
      order: 8,
    },
    {
      title: 'Two Families United in Blessings',
      titleHi: 'दो कुलों का पावन मिलन',
      caption: 'Srivastava and Joshi families exchanging sweets, auspicious gifts, and affection.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (3).webp',
      category: 'family-moments',
      categoryLabel: 'Family Moments',
      categoryLabelHi: 'पारिवारिक क्षण',
      publicId: 'gal_family_3_families_united',
      order: 9,
    },

    // 4. Wedding Celebrations
    {
      title: 'Grand Baraat Procession',
      titleHi: 'शाही बारात एवं भव्य स्वागत',
      caption: 'Celebratory dhol rhythms, dancing family, and groom Nitin arrival.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_y1x1dny1x1dny1x1 (1).webp',
      category: 'wedding-celebrations',
      categoryLabel: 'Wedding Celebrations',
      categoryLabelHi: 'विवाह उत्सव',
      publicId: 'gal_celebration_1_baraat_procession',
      order: 10,
    },
    {
      title: 'The Sacred Varmala Ceremony',
      titleHi: 'वरमाला का पावन क्षण',
      caption: 'Exchanging fragrant floral garlands atop the elevated royal stage.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_y1x1dny1x1dny1x1 (2).webp',
      category: 'wedding-celebrations',
      categoryLabel: 'Wedding Celebrations',
      categoryLabelHi: 'विवाह उत्सव',
      publicId: 'gal_celebration_2_varmala_ceremony',
      order: 11,
    },
    {
      title: 'Royal Courtyard Illumination',
      titleHi: 'विवाह स्थल का अलौकिक प्रकाश',
      caption: 'Brass urlis, floating diyas, and marigold canopies lighting up the night.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (1).webp',
      category: 'wedding-celebrations',
      categoryLabel: 'Wedding Celebrations',
      categoryLabelHi: 'विवाह उत्सव',
      publicId: 'gal_celebration_3_courtyard_illumination',
      order: 12,
    },

    // 5. Indian Wedding Traditions
    {
      title: 'Auspicious Haldi Turmeric Blessing',
      titleHi: 'शुभ हल्दी लेपन संस्कार',
      caption: 'Golden glow of turmeric applied with love and Vedic prayers.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_vgpktmvgpktmvgpk (1).webp',
      category: 'wedding-traditions',
      categoryLabel: 'Wedding Traditions',
      categoryLabelHi: 'वैदिक संस्कार',
      publicId: 'gal_tradition_1_haldi_blessing',
      order: 13,
    },
    {
      title: 'Intricate Bridal Henna Artwork',
      titleHi: 'अदिति की सघन मेहँदी कला',
      caption: 'Detailed bridal mehndi gracing hands with peacock and floral motifs.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb.webp',
      category: 'wedding-traditions',
      categoryLabel: 'Wedding Traditions',
      categoryLabelHi: 'वैदिक संस्कार',
      publicId: 'gal_tradition_2_bridal_henna',
      order: 14,
    },
    {
      title: 'Sacred Hastamelap & Seven Vows',
      titleHi: 'हस्तमिलाप एवं सप्तपदी',
      caption: 'Hands united with sacred kusha grass and holy thread around the sacred Agni.',
      filePath: 'frontend/public/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (5).webp',
      category: 'wedding-traditions',
      categoryLabel: 'Wedding Traditions',
      categoryLabelHi: 'वैदिक संस्कार',
      publicId: 'gal_tradition_3_hastamelap_vows',
      order: 15,
    },
  ];

  // Clean stale gallery to rebuild clean set
  await Gallery.deleteMany({});

  for (const photo of galleryConfigs) {
    console.log(`Uploading Gallery Image #${photo.order}: ${photo.title}...`);
    const cld = await uploadFileToCloudinary(photo.filePath, photo.publicId, 'wedding/gallery', ['gallery', photo.category]);
    console.log(`  Uploaded: ${cld.secureUrl}`);

    const gDoc = await Gallery.create({
      title: photo.title,
      titleHi: photo.titleHi,
      caption: photo.caption,
      imageUrl: cld.secureUrl,
      thumbnailUrl: cld.thumbnailUrl,
      publicId: cld.publicId,
      category: photo.category,
      categoryLabel: photo.categoryLabel,
      categoryLabelHi: photo.categoryLabelHi,
      order: photo.order,
      isPublished: true,
    });

    await MediaAsset.findOneAndUpdate(
      { publicId: cld.publicId },
      {
        filename: `${photo.publicId}.${cld.format}`,
        originalName: path.basename(photo.filePath),
        mimeType: `image/${cld.format}`,
        size: cld.bytes,
        width: cld.width,
        height: cld.height,
        url: cld.secureUrl,
        secureUrl: cld.secureUrl,
        thumbnailUrl: cld.thumbnailUrl,
        publicId: cld.publicId,
        storageProvider: 'cloudinary',
        folder: 'wedding/gallery',
        format: cld.format,
        resourceType: 'image',
        category: 'gallery',
        sectionPlacement: 'gallery',
        altText: `${photo.title} - Aditi & Nitin Royal Wedding`,
        caption: photo.caption,
        order: photo.order,
      },
      { upsert: true }
    );

    console.log(`  Gallery photo saved: #${gDoc.order} "${gDoc.title}"`);
  }

  console.log('\n✅ Successfully uploaded and seeded 4 Events and 15 Gallery Photos to Cloudinary and MongoDB!');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
