import { GalleryPhoto } from '../types/wedding';

/**
 * CENTRALIZED WEDDING IMAGES CONFIGURATION
 * Authentic North Indian Hindu Wedding Photography Catalog
 * Couple: Aditi & Nitin
 * Date: 11 December 2026
 * Location: Gorakhpur, Uttar Pradesh, India
 *
 * All authentic wedding assets are served from /wedding-assets/
 * and fully manageable via the Admin Portal (/admin/dashboard).
 */

export const WEDDING_IMAGES = {
  // Full-Screen Cinematic Welcome Experience
  welcome: {
    invitationScroll: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (12).webp', // #19 Ultra-portrait scroll with Ganesha
    palaceDecor: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (1).webp', // #16 Courtyard marigold decor & lanterns
    ganeshMotif: '/assets/wedding/decorations/lord-ganesha-gold-round.webp',
  },

  // Hero Full-Screen Cinematic Slider (4 Distinct Slides)
  hero: {
    slide1: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354463/wedding/gallery/gal_couple_1_sunset_palace.jpg', // #3 Royal Couple in Crimson Lehenga & Sherwani
    slide2: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354461/wedding/events/wedding_ceremony.jpg', // #9 Vedic Wedding Mandap with Sacred Agni
    slide3: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354484/wedding/gallery/gal_celebration_1_baraat_procession.jpg', // #29 Grand Traditional Baraat on Horseback
    slide4: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354465/wedding/gallery/gal_couple_2_carved_arches.jpg', // #8 Regal Couple Portrait under Carved Arches
    fallbackSlide1: '/wedding-assets/Gemini_Generated_Image_b3ymbrb3ymbrb3ym.webp',
    fallbackSlide2: '/wedding-assets/Gemini_Generated_Image_mtk13zmtk13zmtk1.webp',
    fallbackSlide3: '/wedding-assets/Gemini_Generated_Image_y1x1dny1x1dny1x1 (1).webp',
    fallbackSlide4: '/wedding-assets/Gemini_Generated_Image_mtk13zmtk13zmtk1 (4).webp',
  },

  // Bride Profiles & Solo Portraits (Aditi Srivastava)
  bride: {
    portrait: '/wedding-assets/Gemini_Generated_Image_mtk13zmtk13zmtk1 (2).webp', // #6 Crimson Lehenga, Kundan & Nath
    seated: '/wedding-assets/Gemini_Generated_Image_b3ymbrb3ymbrb3ym (1).webp', // #2 Seated under Palace Arch
    swing: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (6).webp', // #24 On Decorated Floral Swing
  },

  // Groom Profiles & Solo Portraits (Nitin Joshi)
  groom: {
    portrait: '/wedding-assets/Gemini_Generated_Image_mtk13zmtk13zmtk1 (1).webp', // #5 Cream-Gold Sherwani & Stole
    balcony: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (7).webp', // #25 Palace Balcony Overlooking Courtyard
  },

  // Royal Couple Portraits
  couple: {
    palace: '/wedding-assets/Gemini_Generated_Image_b3ymbrb3ymbrb3ym.webp', // #3
    standing: '/wedding-assets/Gemini_Generated_Image_mtk13zmtk13zmtk1 (4).webp', // #8
    closeup: '/wedding-assets/Gemini_Generated_Image_mtk13zmtk13zmtk1 (3).webp', // #7
    garden: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (8).webp', // #26
  },

  // Our Romantic Love Story Timeline Chapters
  ourStory: {
    chapter1: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363478/wedding/story/hjwfaiizwy73qgyyeezy.jpg', // #7 First Meeting
    chapter2: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363480/wedding/story/epbzvyjmdvhtf8cxcaaw.jpg', // #26 Conversations Blossomed
    chapter3: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363483/wedding/story/md76oridvd2hc8uvc34v.jpg', // #21 Families United (Roka)
    chapter4: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363486/wedding/story/hzylphh0u3vle6jg6hnm.jpg', // #18 The Sacred Vow Ahead (Saat Phere)
  },

  // Four Sacred Ceremonies (11 December 2026)
  haldi: {
    ceremony: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354450/wedding/events/haldi_ceremony.jpg', // #10 Haldi Ceremony
    details: '/wedding-assets/Gemini_Generated_Image_vgpktmvgpktmvgpk.webp', // #15 Turmeric Paste Close-Up
    family: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (10).webp', // #17 Family Haldi Petal Shower
  },

  mehndi: {
    ceremony: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354456/wedding/events/mehndi_ceremony.jpg', // #11 Emerald Green Kurti Henna
    details: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb.webp', // #28 Intricate Bridal Henna Hands
  },

  tilak: {
    ceremony: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354458/wedding/events/tilak_ceremony.jpg', // #12 Shubh Tilak Ritual & Thali
    blessings: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (2).webp', // #20 Elders Aarti Blessing
  },

  wedding: {
    kanyadaan: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354461/wedding/events/wedding_ceremony.jpg', // #13 Kanyadaan & Sacred Agni
    pheras: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (11).webp', // #18 Saat Phere Vows
    varmala: '/wedding-assets/Gemini_Generated_Image_y1x1dny1x1dny1x1 (2).webp', // #30 Floral Varmala Exchange
    mandap: '/wedding-assets/Gemini_Generated_Image_evdjl5evdjl5evdj.webp', // #4 Marigold Vedic Mandap
    hastamelap: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (5).webp', // #23 Hastamelap Hand Clasp
    sacredAgni: '/wedding-assets/Gemini_Generated_Image_mtk13zmtk13zmtk1.webp', // #9 Agni & Pheras
  },

  // Cherished Families (Bride & Groom Sides)
  family: {
    srivastava: '/wedding-assets/Gemini_Generated_Image_6rsl0g6rsl0g6rsl.webp', // #1 Srivastava Courtyard Banquet
    joshi: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (10).webp', // #17 Joshi Family Gathering
    united: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (3).webp', // #21 Families United in Joy
  },

  // Architectural Venue & Wedding Decor
  venue: {
    courtyard: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (9).webp', // #27 Illuminated Palace Courtyard
    palace: '/wedding-assets/Gemini_Generated_Image_evdjl5evdjl5evdj.webp', // #4 Royal Mandap Pavilion
  },

  decorations: {
    mandap: '/wedding-assets/Gemini_Generated_Image_evdjl5evdjl5evdj.webp', // #4
    rangoli: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (1).webp', // #16
    havanKund: '/wedding-assets/Gemini_Generated_Image_y1x1dny1x1dny1x1 (4).webp', // #32
    entrance: '/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (9).webp', // #27
  },

  // Curated 15 Unique Photographs Across 5 Categories
  gallery: [
    // 1. Aditi & Nitin (Couple Portraits)
    {
      id: 'gal-couple-1',
      title: 'Royal Couple at Sunset Palace',
      titleHi: 'शाही महल में वर-वधू',
      caption: 'Aditi and Nitin in regal crimson lehenga and cream sherwani framed by majestic palace arches.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354463/wedding/gallery/gal_couple_1_sunset_palace.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_couple_1_sunset_palace.webp',
      category: 'aditi-nitin',
      categoryLabel: 'Aditi & Nitin',
      categoryLabelHi: 'अदिति एवं नितिन',
      order: 1,
    },
    {
      id: 'gal-couple-2',
      title: 'Regal Elegance under Carved Arches',
      titleHi: 'नक्काशीदार मेहराबों तले राजसी आभा',
      caption: 'Standing together in timeless grace, sharing promises of eternity.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354465/wedding/gallery/gal_couple_2_carved_arches.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_couple_2_carved_arches.webp',
      category: 'aditi-nitin',
      categoryLabel: 'Aditi & Nitin',
      categoryLabelHi: 'अदिति एवं नितिन',
      order: 2,
    },
    {
      id: 'gal-couple-3',
      title: 'Bride Aditi on Floral Swing',
      titleHi: 'पुष्प झूले पर दुल्हन अदिति',
      caption: 'Elegance and joy adorned with fragrant jasmine and marigold blooms.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354471/wedding/gallery/gal_couple_3_floral_swing.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_couple_3_floral_swing.webp',
      category: 'aditi-nitin',
      categoryLabel: 'Aditi & Nitin',
      categoryLabelHi: 'अदिति एवं नितिन',
      order: 3,
    },

    // 2. Pre-Wedding
    {
      id: 'gal-prewedding-1',
      title: 'Garden Romance at Dusk',
      titleHi: 'उद्यान में स्वर्णिम संध्या',
      caption: 'A tender twilight stroll through heritage palace gardens.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354472/wedding/gallery/gal_prewedding_1_garden_romance.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_prewedding_1_garden_romance.webp',
      category: 'pre-wedding',
      categoryLabel: 'Pre-Wedding',
      categoryLabelHi: 'प्री-वेडिंग',
      order: 4,
    },
    {
      id: 'gal-prewedding-2',
      title: 'Sangeet Celebration Dance',
      titleHi: 'संगीत उत्सव का उल्लासमय नृत्य',
      caption: 'Rhythms of joy, glittering royal blue attire, and heartfelt laughter.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354474/wedding/gallery/gal_prewedding_2_sangeet_dance.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_prewedding_2_sangeet_dance.webp',
      category: 'pre-wedding',
      categoryLabel: 'Pre-Wedding',
      categoryLabelHi: 'प्री-वेडिंग',
      order: 5,
    },
    {
      id: 'gal-prewedding-3',
      title: 'Festive Musical Night',
      titleHi: 'उत्सवमयी संगीतमय रात्रि',
      caption: 'Under fairy lights and royal chandeliers, celebrating timeless love.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354477/wedding/gallery/gal_prewedding_3_musical_night.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_prewedding_3_musical_night.webp',
      category: 'pre-wedding',
      categoryLabel: 'Pre-Wedding',
      categoryLabelHi: 'प्री-वेडिंग',
      order: 6,
    },

    // 3. Family Moments
    {
      id: 'gal-family-1',
      title: 'Heritage Family Courtyard Banquet',
      titleHi: 'आँगन में पारिवारिक प्रीतिभोज',
      caption: 'Multi-generational warmth and shared memories in the haveli courtyard.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354478/wedding/gallery/gal_family_1_courtyard_banquet.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_family_1_courtyard_banquet.webp',
      category: 'family-moments',
      categoryLabel: 'Family Moments',
      categoryLabelHi: 'पारिवारिक क्षण',
      order: 7,
    },
    {
      id: 'gal-family-2',
      title: "Elders' Marigold Petal Shower",
      titleHi: 'बुजुर्गों का अक्षत व पुष्प वर्षा आशीर्वाद',
      caption: 'Cherished blessings showered upon the couple by loving parents and elders.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354480/wedding/gallery/gal_family_2_petal_shower.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_family_2_petal_shower.webp',
      category: 'family-moments',
      categoryLabel: 'Family Moments',
      categoryLabelHi: 'पारिवारिक क्षण',
      order: 8,
    },
    {
      id: 'gal-family-3',
      title: 'Two Families United in Blessings',
      titleHi: 'दो कुलों का पावन मिलन',
      caption: 'Srivastava and Joshi families exchanging sweets, auspicious gifts, and affection.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354483/wedding/gallery/gal_family_3_families_united.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_family_3_families_united.webp',
      category: 'family-moments',
      categoryLabel: 'Family Moments',
      categoryLabelHi: 'पारिवारिक क्षण',
      order: 9,
    },

    // 4. Wedding Celebrations
    {
      id: 'gal-celebration-1',
      title: 'Grand Baraat Procession',
      titleHi: 'शाही बारात एवं भव्य स्वागत',
      caption: 'Celebratory dhol rhythms, dancing family, and groom Nitin arrival.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354484/wedding/gallery/gal_celebration_1_baraat_procession.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_celebration_1_baraat_procession.webp',
      category: 'wedding-celebrations',
      categoryLabel: 'Wedding Celebrations',
      categoryLabelHi: 'विवाह उत्सव',
      order: 10,
    },
    {
      id: 'gal-celebration-2',
      title: 'The Sacred Varmala Ceremony',
      titleHi: 'वरमाला का पावन क्षण',
      caption: 'Exchanging fragrant floral garlands atop the elevated royal stage.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354491/wedding/gallery/gal_celebration_2_varmala_ceremony.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_celebration_2_varmala_ceremony.webp',
      category: 'wedding-celebrations',
      categoryLabel: 'Wedding Celebrations',
      categoryLabelHi: 'विवाह उत्सव',
      order: 11,
    },
    {
      id: 'gal-celebration-3',
      title: 'Royal Courtyard Illumination',
      titleHi: 'विवाह स्थल का अलौकिक प्रकाश',
      caption: 'Brass urlis, floating diyas, and marigold canopies lighting up the night.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354494/wedding/gallery/gal_celebration_3_courtyard_illumination.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_celebration_3_courtyard_illumination.webp',
      category: 'wedding-celebrations',
      categoryLabel: 'Wedding Celebrations',
      categoryLabelHi: 'विवाह उत्सव',
      order: 12,
    },

    // 5. Indian Wedding Traditions
    {
      id: 'gal-tradition-1',
      title: 'Auspicious Haldi Turmeric Blessing',
      titleHi: 'शुभ हल्दी लेपन संस्कार',
      caption: 'Golden glow of turmeric applied with love and Vedic prayers.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354496/wedding/gallery/gal_tradition_1_haldi_blessing.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_tradition_1_haldi_blessing.webp',
      category: 'wedding-traditions',
      categoryLabel: 'Wedding Traditions',
      categoryLabelHi: 'वैदिक संस्कार',
      order: 13,
    },
    {
      id: 'gal-tradition-2',
      title: 'Intricate Bridal Henna Artwork',
      titleHi: 'अदिति की सघन मेहँदी कला',
      caption: 'Detailed bridal mehndi gracing hands with peacock and floral motifs.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354499/wedding/gallery/gal_tradition_2_bridal_henna.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_tradition_2_bridal_henna.webp',
      category: 'wedding-traditions',
      categoryLabel: 'Wedding Traditions',
      categoryLabelHi: 'वैदिक संस्कार',
      order: 14,
    },
    {
      id: 'gal-tradition-3',
      title: 'Sacred Hastamelap & Seven Vows',
      titleHi: 'हस्तमिलाप एवं सप्तपदी',
      caption: 'Hands united with sacred kusha grass and holy thread around the sacred Agni.',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354500/wedding/gallery/gal_tradition_3_hastamelap_vows.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,h_400,q_auto,w_400/v1/wedding/gallery/gal_tradition_3_hastamelap_vows.webp',
      category: 'wedding-traditions',
      categoryLabel: 'Wedding Traditions',
      categoryLabelHi: 'वैदिक संस्कार',
      order: 15,
    },
  ] as GalleryPhoto[],
};

/**
 * Backward-compatible alias for existing components
 */
export const WEDDING_IMAGE_CATALOG = {
  hero: WEDDING_IMAGES.hero,
  couple: {
    bride: WEDDING_IMAGES.bride.portrait,
    groom: WEDDING_IMAGES.groom.portrait,
    couplePortrait: WEDDING_IMAGES.couple.palace,
  },
  ourStory: WEDDING_IMAGES.ourStory,
  events: {
    haldi: WEDDING_IMAGES.haldi.ceremony,
    haldiThali: WEDDING_IMAGES.haldi.details,
    mehndi: WEDDING_IMAGES.mehndi.ceremony,
    mehndiDetails: WEDDING_IMAGES.mehndi.details,
    tilak: WEDDING_IMAGES.tilak.ceremony,
    tilakRituals: WEDDING_IMAGES.tilak.blessings,
    wedding: WEDDING_IMAGES.wedding.kanyadaan,
    weddingPheras: WEDDING_IMAGES.wedding.pheras,
    weddingMandap: WEDDING_IMAGES.wedding.mandap,
  },
  family: WEDDING_IMAGES.family,
  decorations: {
    mandap: WEDDING_IMAGES.decorations.mandap,
    rangoli: WEDDING_IMAGES.decorations.rangoli,
    venueGorakhpur: WEDDING_IMAGES.venue.courtyard,
    ogPreview: WEDDING_IMAGES.hero.slide1,
  },
  gallery: WEDDING_IMAGES.gallery,
};
