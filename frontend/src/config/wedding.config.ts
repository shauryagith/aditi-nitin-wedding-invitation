import { WeddingConfig, WeddingEventItem, GalleryPhoto, StoryMilestone } from '../types/wedding';
import { WEDDING_IMAGES, WEDDING_IMAGE_CATALOG } from './weddingImages';

/**
 * WEDDING MASTER CONFIGURATION
 * Aditi & Nitin Royal Indian Hindu Wedding
 * Location: Gorakhpur, Uttar Pradesh, India
 * Date: 11 December 2026
 */

export const IS_DATE_CONFIRMED = true;

// Configured wedding date in Asia/Kolkata timezone (ISO format)
// Friday, 11 December 2026, 19:00 IST
export const WEDDING_DATE_ISO = '2026-12-11T19:00:00+05:30';

export const WEDDING_CONFIG: WeddingConfig = {
  bride: {
    name: 'Aditi',
    nameHi: 'अदिति',
    fullName: 'Aditi Srivastava',
    fullNameHi: 'अदिति श्रीवास्तव',
    role: 'Bride',
    roleHi: 'वधू',
    mother: 'Smt. Meera Devi',
    motherHi: 'श्रीमती मीरा देवी',
    father: 'Shri KBL Srivastava',
    fatherHi: 'श्री के. बी. एल. श्रीवास्तव',
    bio: 'An accomplished with a graceful demeanor and deep reverence for family traditions. Lover of classical melodies, art, and heartwarming family conversations.',
    bioHi: 'सुलझी हुई, संवेदनशील और पारिवारिक संस्कारों से ओत-प्रोत। अपनी मधुर मुस्कान और सकारात्मक ऊर्जा से हर महफ़िल में खुशियाँ बिखेरने वाली।',
    photoUrl: WEDDING_IMAGE_CATALOG.couple.bride,
    socialLinks: {
      instagram: 'https://instagram.com/',
    },
  },
  groom: {
    name: 'Nitin',
    nameHi: 'नितिन',
    fullName: 'Nitin Joshi',
    fullNameHi: 'नितिन जोशी',
    role: 'Groom',
    roleHi: 'वर',
    mother: 'Smt. Suman',
    motherHi: 'श्रीमती सुमन',
    father: 'Shri Lalit Mohan Ji',
    fatherHi: 'श्री ललित मोहन जी',
    bio: 'A visionary tech professional, avid traveler, and deeply grounded soul with boundless love for family values. Ready to embark on this sacred journey of companionship.',
    bioHi: 'दृढ़ निश्चयी, विचारवान और परंपराओं के प्रति निष्ठावान। जीवन के हर पल को उमंग, आत्मीयता और निष्ठा के साथ जीने वाले।',
    photoUrl: WEDDING_IMAGE_CATALOG.couple.groom,
    socialLinks: {
      instagram: 'https://instagram.com/',
    },
  },
  weddingDate: WEDDING_DATE_ISO,
  weddingDateFormatted: 'Friday, 11 December 2026',
  weddingDateFormattedHi: 'शुक्रवार, ११ दिसम्बर २०२६',
  timezone: 'Asia/Kolkata',
  venue: {
    name: 'Srivastava Niwas',
    nameHi: 'श्रीवास्तव निवास',
    address: '002E Bank Colony, Padari Bazaar, Gorakhpur, Uttar Pradesh, 273014, India',
    addressHi: '००२ई बैंक कॉलोनी, पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश, २७३०१४, भारत',
    landmark: 'Near Bank Colony Main Road, Padari Bazaar',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    pincode: '273014',
    country: 'India',
    mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur,+Uttar+Pradesh+273014',
    embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14246.331291889704!2d83.398018!3d26.790589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991448b11a91e57%3A0x67db2bbfbc2990a4!2sPadri%20Bazar%2C%20Gorakhpur%2C%20Uttar%20Pradesh%20273014!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    photoUrl: WEDDING_IMAGE_CATALOG.decorations.venueGorakhpur,
    directionsTips: 'Easily accessible from Gorakhpur Junction Railway Station (~6 km) and Gorakhpur Airport (~10 km). Pre-paid cabs and autos are readily available to Padari Bazaar.',
    directionsTipsHi: 'गोरखपुर जंक्शन रेलवे स्टेशन (~६ किमी) एवं गोरखपुर हवाई अड्डे (~१० किमी) से सुगमता से ऑटो अथवा टैक्सी द्वारा पादरी बाज़ार पहुँचा जा सकता है।',
  },
  traditionalBlessing: {
    sanskrit: 'माङ्गल्यं तन्तुनानेन लोकजीवनहेतुना। कण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम्॥',
    hindi: 'यह पावन मंगलसूत्र तुम्हारे कंठ में धारण कराता हूँ, जो हमारे जीवन का आधार बने और हम सौ शरदों तक सौभाग्य और सौहार्द के साथ जिएं।',
    english: 'This sacred thread, the auspicious bond of our lives, I tie around your neck. May we live together in harmony, health, and happiness for a hundred autumns.',
  },
  invitationMessage: {
    english: 'With the divine blessings of our ancestors and elders, we, the Srivastava and Joshi families, cordially invite you to celebrate the joyous union as Aditi and Nitin tie the sacred knot in the timeless tradition of Vedic vivah.',
    hindi: 'ईश्वर एवं पूर्वजों के असीम अनुग्रह से, श्रीवास्तव एवं जोशी परिवार आपको अदिति एवं नितिन के परिणय संस्कार के इस पावन उत्सव में सस्नेह आमंत्रित करते हैं। आपकी गरिमामयी उपस्थिति नवदम्पति के लिए अनमोल आशीर्वाद बनेगी।',
  },
  storyMilestones: [
    {
      id: 'story-1',
      title: 'When Two Souls First Met',
      titleHi: 'जब दो राहें एक हुईं',
      dateStr: 'Autumn 2024',
      dateStrHi: 'शरद २०२४',
      description: 'A serene afternoon introduction that sparked hours of unhurried conversation. From shared aspirations to fond childhood memories, time slipped away effortlessly.',
      descriptionHi: 'एक शांत दोपहर की पहली औपचारिक मुलाक़ात, जो घंटों की आत्मीय बातचीत में बदल गई। विचारों की सहजता और प्राथमिकताओं का ऐसा सामंजस्य, जैसे दो रूहें वर्षों से परिचित हों।',
      image: WEDDING_IMAGE_CATALOG.ourStory.chapter1,
      quote: 'In the quietest moments, destiny finds its gentle rhythm.',
      quoteHi: 'जहाँ शब्दों से परे, भावनाएँ अपनी पवित्रता में संवाद करती हैं।',
    },
    {
      id: 'story-2',
      title: 'Conversations That Blossomed',
      titleHi: 'बातचीत जो अनुराग बन गई',
      dateStr: 'Spring 2025',
      dateStrHi: 'वसंत २०२५',
      description: 'Morning tea chats turned into shared dreams, mutual encouragement, and understanding each other with gentle respect and warmth.',
      descriptionHi: 'एक-दूसरे के सपनों का सम्मान, जीवन के हर पहलू पर खुलकर विचार और परिवार के प्रति साझा निष्ठा ने इस रिश्ते को दृढ़ और प्रगाढ़ बना दिया।',
      image: WEDDING_IMAGE_CATALOG.ourStory.chapter2,
      quote: 'Love is not just finding someone you can live with; it is finding someone you cannot live without.',
      quoteHi: 'सच्चा प्रेम केवल साथ रहना नहीं, बल्कि एक दूसरे का संबल बनना है।',
    },
    {
      id: 'story-3',
      title: 'Families United in Joy (Roka & Blessings)',
      titleHi: 'दो परिवारों का स्नेहिल मिलन (रोका)',
      dateStr: 'Monsoon 2025',
      dateStrHi: 'मानसून २०२५',
      description: 'With traditional sweets, Vedic chants, and tears of joy, both parents embraced each other, sanctifying the promise of a lifetime.',
      descriptionHi: 'मिठाइयों की मिठास, वैदिक श्लोक और परिजनों के अश्रुपूरित आशीर्वाद के साथ दोनों परिवारों ने एक होकर इस पवित्र बंधन पर अपनी मुहर लगाई।',
      image: WEDDING_IMAGE_CATALOG.ourStory.chapter3,
      quote: 'Two families, bound by culture, heritage, and pure affection.',
      quoteHi: 'संस्कारों का संगम और दो कुलों का मंगलकारी एकीकरण।',
    },
    {
      id: 'story-4',
      title: 'The Sacred Vow Ahead',
      titleHi: 'सप्तपदी और अनंत समर्पण',
      dateStr: '11 December 2026',
      dateStrHi: '११ दिसम्बर २०२६',
      description: 'Walking hand in hand around the sacred Agni, taking seven timeless vows of partnership, loyalty, and boundless affection.',
      descriptionHi: 'पवित्र अग्नि के समक्ष सात फेरे लेकर, जीवन की हर धूप-छाँव में एक दूसरे का हाथ थामे रहने का पावन संकल्प।',
      image: WEDDING_IMAGE_CATALOG.ourStory.chapter4,
      quote: 'Walking together towards eternity, hand in hand.',
      quoteHi: 'जीवन की नई यात्रा का शुभारंभ, आपके आशीषों के साथ।',
    },
  ],
  contact: {
    primaryPhone: '+91-9876543210',
    whatsappNumber: '919876543210',
    email: 'aditi.nitin.wedding@gmail.com',
  },
  music: {
    title: 'Mangalyam Tantunanena (Shehnai & Sitar Traditional)',
    artist: 'Royal Indian Wedding Symphony',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65955635.mp3?filename=indian-flute-and-sitar-peace-111893.mp3',
  },
  seo: {
    title: 'Aditi ❤️ Nitin – Royal Indian Wedding Invitation',
    description: 'We cordially invite you to celebrate the royal wedding of Aditi and Nitin on 11 December 2026 in Gorakhpur.',
    siteUrl: typeof window !== 'undefined' ? window.location.origin : 'https://aditinitinwedding.com',
    ogImage: WEDDING_IMAGES.hero.slide1,
  },
};

/**
 * FOUR CORE WEDDING CEREMONIES – ALL ON 11 DECEMBER 2026
 * Notice:
 * - NO dress code anywhere.
 * - Editable timings (only displayed when configured).
 */
export const INITIAL_WEDDING_EVENTS: WeddingEventItem[] = [
  {
    id: 'evt-haldi',
    slug: 'haldi',
    title: 'Haldi Ceremony',
    titleHi: 'शुभ हल्दी उत्सव',
    date: '2026-12-11',
    formattedDate: 'Friday, 11 December 2026',
    formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
    startTime: '10:00 AM', // Editable ceremony timing - displays only when configured
    endTime: '01:00 PM',
    venue: 'Courtyard Lawn, 002E Bank Colony',
    venueHi: 'प्रांगण, ००२ई बैंक कॉलोनी, गोरखपुर',
    address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
    addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
    description: 'Auspicious yellow marigold flower showers, fresh turmeric paste blessings, traditional folk dhol beats, and joyful laughter as loved ones bless the couple.',
    descriptionHi: 'पीत वर्ण हल्दी का उबटन, गेंदे के फूलों की सुगंधित वर्षा, ढोल की थाप और परिजनों के मंगल गान के बीच पावन हल्दी संस्कार।',
    image: WEDDING_IMAGE_CATALOG.events.haldi,
    accentColor: '#EAB308', // Marigold Yellow
    badgeColor: 'bg-amber-500 text-maroon-950',
    mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
    order: 1,
  },
  {
    id: 'evt-mehndi',
    slug: 'mehndi',
    title: 'Mehndi Ceremony',
    titleHi: 'मेहँदी उत्सव',
    date: '2026-12-11',
    formattedDate: 'Friday, 11 December 2026',
    formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
    startTime: '02:30 PM', // Editable ceremony timing
    endTime: '05:30 PM',
    venue: 'Terrace Garden, 002E Bank Colony',
    venueHi: 'टेरेस गार्डन, ००२ई बैंक कॉलोनी, गोरखपुर',
    address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
    addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
    description: 'Exquisite bridal henna artistry, soothing green & golden floral decorations, traditional Indian songs, folk dances, and celebratory delicacies.',
    descriptionHi: 'हथेलियों पर रचेगी पिया के नाम की सघन मेहँदी, सुहावने गीतों की मधुर झंकार, हरी-सुनहरी सजावट और उल्लासमय उत्सव।',
    image: WEDDING_IMAGE_CATALOG.events.mehndi,
    accentColor: '#166534', // Emerald / Henna Green
    badgeColor: 'bg-emerald-700 text-white',
    mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
    order: 2,
  },
  {
    id: 'evt-tilak',
    slug: 'tilak',
    title: 'Shubh Tilak Ceremony',
    titleHi: 'शुभ तिलक समारोह',
    date: '2026-12-11',
    formattedDate: 'Friday, 11 December 2026',
    formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
    startTime: '05:30 PM', // Editable ceremony timing
    endTime: '07:30 PM',
    venue: 'Royal Hall, 002E Bank Colony',
    venueHi: 'रॉयल हॉल, ००२ई बैंक कॉलोनी, गोरखपुर',
    address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
    addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
    description: 'Vedic rituals with ceremonial thali, kumkum, akshat, sacred coconut, and royal traditional gifts as both families exchange sacred acceptance and respect.',
    descriptionHi: 'कुमकुम, अक्षत, नारियल और मंगल थाली से सुसज्जित वैदिक रीति द्वारा वर पक्ष का स्वागत एवं दोनों कुलों का परस्पर सम्मान व तिलक संस्कार।',
    image: WEDDING_IMAGE_CATALOG.events.tilak,
    accentColor: '#C2410C', // Kumkum Vermilion
    badgeColor: 'bg-orange-700 text-white',
    mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
    order: 3,
  },
  {
    id: 'evt-wedding',
    slug: 'wedding-ceremony',
    title: 'Wedding Ceremony (Vivah)',
    titleHi: 'शुभ विवाह संस्कार (पाणिग्रहण)',
    date: '2026-12-11',
    formattedDate: 'Friday, 11 December 2026',
    formattedDateHi: 'शुक्रवार, ११ दिसम्बर २०२६',
    startTime: '07:30 PM', // Editable ceremony timing
    endTime: 'Midnight',
    venue: 'Royal Wedding Pavilion, 002E Bank Colony',
    venueHi: 'विवाह मंडप, ००२ई बैंक कॉलोनी, गोरखपुर',
    address: 'Padari Bazaar, Gorakhpur, Uttar Pradesh 273014',
    addressHi: 'पादरी बाज़ार, गोरखपुर, उत्तर प्रदेश २७३०१४',
    description: 'The sacred grand ceremony: Royal Baraat welcome, Jaimala garland exchange, Kanyadaan, and Saat Phere around the sacred Agni amidst Vedic chants.',
    descriptionHi: 'शाही बारात स्वागत, भव्य जयमाला, पावन अग्नि के समक्ष सप्तपदी (सात फेरे), कन्यादान और जीवनभर के लिए सिंदूर व मंगलसूत्र समर्पण।',
    image: WEDDING_IMAGE_CATALOG.events.wedding,
    accentColor: '#581C2B', // Regal Maroon & Gold
    badgeColor: 'bg-maroon-800 text-gold-300 border border-gold-400',
    mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
    order: 4,
  },
];

export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = WEDDING_IMAGES.gallery;
