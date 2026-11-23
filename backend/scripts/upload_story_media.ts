import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { ENV } from '../src/config/env.js';
import { Wedding } from '../src/models/Wedding.js';
import { MediaAsset } from '../src/models/MediaAsset.js';
import { storageService } from '../src/services/storage/index.js';

interface StoryChapterDef {
  id: string;
  order: number;
  title: string;
  titleHi: string;
  dateStr: string;
  dateStrHi: string;
  description: string;
  descriptionHi: string;
  quote: string;
  quoteHi: string;
  localFile: string;
  publicId: string;
}

const CHAPTERS: StoryChapterDef[] = [
  {
    id: 'story-1',
    order: 1,
    title: 'When Two Souls First Met',
    titleHi: 'जब दो राहें एक हुईं',
    dateStr: 'Autumn 2024',
    dateStrHi: 'शरद २०२४',
    description:
      'A serene afternoon introduction that sparked hours of unhurried conversation. From shared aspirations to fond childhood memories, time slipped away effortlessly.',
    descriptionHi:
      'एक शांत दोपहर की पहली औपचारिक मुलाक़ात, जो घंटों की आत्मीय बातचीत में बदल गई। विचारों की सहजता और प्राथमिकताओं का ऐसा सामंजस्य, जैसे दो रूहें वर्षों से परिचित हों।',
    quote: 'In the quietest moments, destiny finds its gentle rhythm.',
    quoteHi: 'जहाँ शब्दों से परे, भावनाएँ अपनी पवित्रता में संवाद करती हैं।',
    localFile: 'frontend/public/wedding-assets/Gemini_Generated_Image_mtk13zmtk13zmtk1 (3).webp',
    publicId: 'wedding/story/story_chapter_1_first_meeting',
  },
  {
    id: 'story-2',
    order: 2,
    title: 'Conversations That Blossomed',
    titleHi: 'बातचीत जो अनुराग बन गई',
    dateStr: 'Spring 2025',
    dateStrHi: 'वसंत २०२५',
    description:
      'Morning tea chats turned into shared dreams, mutual encouragement, and understanding each other with gentle respect and warmth.',
    descriptionHi:
      'एक-दूसरे के सपनों का सम्मान, जीवन के हर पहलू पर खुलकर विचार और परिवार के प्रति साझा निष्ठा ने इस रिश्ते को दृढ़ और प्रगाढ़ बना दिया।',
    quote: 'Love is not just finding someone you can live with; it is finding someone you cannot live without.',
    quoteHi: 'सच्चा प्रेम केवल साथ रहना नहीं, बल्कि एक दूसरे का संबल बनना है।',
    localFile: 'frontend/public/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (8).webp',
    publicId: 'wedding/story/story_chapter_2_conversations',
  },
  {
    id: 'story-3',
    order: 3,
    title: 'Families United in Joy (Roka & Blessings)',
    titleHi: 'दो परिवारों का स्नेहिल मिलन (रोका)',
    dateStr: 'Monsoon 2025',
    dateStrHi: 'मानसून २०२५',
    description:
      'With traditional sweets, Vedic chants, and tears of joy, both parents embraced each other, sanctifying the promise of a lifetime.',
    descriptionHi:
      'मिठाइयों की मिठास, वैदिक श्लोक और परिजनों के अश्रुपूरित आशीर्वाद के साथ दोनों परिवारों ने एक होकर इस पवित्र बंधन पर अपनी मुहर लगाई।',
    quote: 'Two families, bound by culture, heritage, and pure affection.',
    quoteHi: 'संस्कारों का संगम और दो कुलों का मंगलकारी एकीकरण।',
    localFile: 'frontend/public/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (3).webp',
    publicId: 'wedding/story/story_chapter_3_families_united',
  },
  {
    id: 'story-4',
    order: 4,
    title: 'The Sacred Vow Ahead',
    titleHi: 'सप्तपदी और अनंत समर्पण',
    dateStr: '11 December 2026',
    dateStrHi: '११ दिसम्बर २०२६',
    description:
      'Walking hand in hand around the sacred Agni, taking seven timeless vows of partnership, loyalty, and boundless affection.',
    descriptionHi:
      'पवित्र अग्नि के समक्ष सात फेरे और जीवन भर साथ निभाने का पावन संकल्प। परंपराओं, मर्यादा और अटूट निष्ठा का स्वर्णिम उत्सव।',
    quote: 'Walking together towards eternity, hand in hand.',
    quoteHi: 'जीवन की नई यात्रा का शुभारंभ, आपके आशीषों के साथ।',
    localFile: 'frontend/public/wedding-assets/Gemini_Generated_Image_wuxbd2wuxbd2wuxb (11).webp',
    publicId: 'wedding/story/story_chapter_4_sacred_vows',
  },
];

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(ENV.MONGODB_URI);

  const updatedMilestones = [];

  for (const ch of CHAPTERS) {
    const fullPath = path.resolve(ch.localFile);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    console.log(`Uploading ${ch.title} (${fileBuffer.length} bytes) to Cloudinary...`);

    let secureUrl = '';
    try {
      const uploadResult = await storageService.uploadImage(fileBuffer, path.basename(ch.localFile), 'image/webp', {
        category: 'our-story',
        altText: `Aditi & Nitin Story - ${ch.title}`,
        folder: 'wedding/story',
      });
      secureUrl = uploadResult.secureUrl;
      console.log(`Uploaded: ${secureUrl}`);

      // Persist in MediaAsset
      await MediaAsset.findOneAndUpdate(
        { publicId: uploadResult.publicId },
        {
          filename: uploadResult.filename,
          originalName: uploadResult.originalName,
          mimeType: 'image/webp',
          size: uploadResult.size,
          width: uploadResult.width || 800,
          height: uploadResult.height || 600,
          url: uploadResult.url,
          secureUrl: uploadResult.secureUrl,
          webpUrl: uploadResult.webpUrl,
          thumbnailUrl: uploadResult.thumbnailUrl,
          publicId: uploadResult.publicId,
          storageProvider: 'cloudinary',
          folder: 'wedding/story',
          format: uploadResult.format,
          category: 'our-story',
          altText: `Aditi & Nitin Story - ${ch.title}`,
          isDesktop: true,
          isMobile: true,
          order: ch.order,
        },
        { upsert: true }
      );
    } catch (err: any) {
      console.warn(`Cloudinary upload notice for ${ch.title}: ${err.message}. Using local path.`);
      secureUrl = `/wedding-assets/${path.basename(ch.localFile)}`;
    }

    updatedMilestones.push({
      id: ch.id,
      order: ch.order,
      title: ch.title,
      titleHi: ch.titleHi,
      date: ch.dateStr,
      dateStr: ch.dateStr,
      dateStrHi: ch.dateStrHi,
      description: ch.description,
      descriptionHi: ch.descriptionHi,
      quote: ch.quote,
      quoteHi: ch.quoteHi,
      image: secureUrl,
      publicId: ch.publicId,
    });
  }

  let wedding = await Wedding.findOne();
  if (!wedding) {
    wedding = new Wedding();
  }

  wedding.storyMilestones = updatedMilestones as any;
  await wedding.save();

  console.log(`Successfully updated wedding.storyMilestones with ${updatedMilestones.length} chapters.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Fatal error in story migration:', err);
  process.exit(1);
});
