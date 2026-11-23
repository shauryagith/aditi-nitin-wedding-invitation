import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import mongoose from 'mongoose';
import { Wedding } from '../src/models/Wedding.js';

const PUBLISHED_STORY_MILESTONES = [
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
];

async function syncStory() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');
  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');

  let wedding = await Wedding.findOne();
  if (!wedding) {
    wedding = new Wedding();
  }

  wedding.storyMilestones = PUBLISHED_STORY_MILESTONES as any;
  await wedding.save();
  console.log('Successfully saved all 4 published Our Story milestones to MongoDB Atlas!');
  await mongoose.disconnect();
}

syncStory().catch((err) => {
  console.error(err);
  process.exit(1);
});
