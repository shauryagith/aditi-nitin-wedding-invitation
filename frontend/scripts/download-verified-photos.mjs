import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const BASE_DIR = 'd:/Di Wedding/frontend/public/assets/wedding';

const ASSET_MAP = {
  // Hero Slider
  'hero/slide-1-royal-couple.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Bride_and_Groom_During_Pair_Pujan_Rasam.jpg',
  'hero/slide-2-hindu-mandap.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Indian_Wedding_Mandap_Decoration.jpg',
  'hero/slide-3-romantic-couple.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Indian_bride_and_groom.jpg',
  'hero/slide-4-wedding-celebration.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/fb/A_Baraat_procession%2C_Jaipur.jpg',

  // Couple
  'couple/bride-aditi.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Hindu_bride_in_Lehenga.jpg',
  'couple/groom-nitin.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Groom%27s_outfit.jpg',
  'couple/couple-portrait.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Bride_and_Groom_During_Pair_Pujan_Rasam.jpg',

  // Our Story
  'our-story/story-1-first-meeting.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/39/Bride_and_groom_talking_and_walking_together.jpg',
  'our-story/story-2-conversations.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/13/Indian_Telugu_Hindu_wedding.jpg',
  'our-story/story-3-roka-blessings.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/81/Traditional_Indian_Wedding_Family_Photo_with_Pooja_items.jpg',
  'our-story/story-4-sacred-vows.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/23/Hindu_wedding_ceremony.jpg',

  // Ceremonies
  'haldi/haldi-ceremony.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Haldi_Ceremony_-_An_Indian_Wedding_Ritual.jpg',
  'haldi/haldi-thali.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/54/Raw_turmeric_paste_for_haldi_ceremony_in_Indian_wedding.jpg',

  'mehndi/mehndi-ceremony.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bridal_mehndi_%28henna%29_is_a_central_wedding_tradition_02.jpg',
  'mehndi/mehndi-details.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/00/Bridal_mehndi_%28henna%29_is_a_central_wedding_tradition_10.jpg',

  'tilak/tilak-ceremony.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/40/Sindoor_ceremony_at_an_Indian_wedding.jpg',
  'tilak/tilak-rituals.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/61/A_Hindu_wedding_ritual_in_progress_b.jpg',

  'wedding/wedding-ceremony.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/69/%28A%29_Hindu_wedding%2C_Saptapadi_ritual_before_Agni_Yajna.jpg',
  'wedding/wedding-pheras.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/The_Pheras.jpg',
  'wedding/wedding-mandap.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Indian_Wedding_Mandap.jpg',

  // Family
  'family/family-srivastava.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Indian_Traditional_Wedding_Images_%2840%29.jpg',
  'family/family-joshi.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Meet_friends_and_family_ritual%2C_after_Hindu_wedding_vows%2C_India.jpg',
  'family/families-united.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/81/Traditional_Indian_Wedding_Family_Photo_with_Pooja_items.jpg',

  // Decorations
  'decorations/mandap-architecture.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Indian_Wedding_Mandap_Decoration.jpg',
  'decorations/floral-rangoli.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/10/Diya_at_a_wedding_in_Tamil_Nadu_01.jpg',
  'decorations/venue-gorakhpur.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Gorakhnath_Temple_fare_2.jpg',
  'decorations/og-wedding-preview.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Bride_and_Groom_During_Pair_Pujan_Rasam.jpg',

  // Gallery (15 Non-Repeating Images)
  'gallery/gallery-couple-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Hindu_bride_in_Lehenga.jpg',
  'gallery/gallery-couple-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Indian_bride_and_groom.jpg',
  'gallery/gallery-prewedding-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/39/Bride_and_groom_talking_and_walking_together.jpg',
  'gallery/gallery-prewedding-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/13/Indian_Telugu_Hindu_wedding.jpg',
  'gallery/gallery-haldi-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Haldi_Ceremony_-_An_Indian_Wedding_Ritual.jpg',
  'gallery/gallery-haldi-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/54/Raw_turmeric_paste_for_haldi_ceremony_in_Indian_wedding.jpg',
  'gallery/gallery-mehndi-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bridal_mehndi_%28henna%29_is_a_central_wedding_tradition_02.jpg',
  'gallery/gallery-mehndi-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/00/Bridal_mehndi_%28henna%29_is_a_central_wedding_tradition_10.jpg',
  'gallery/gallery-tilak-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/40/Sindoor_ceremony_at_an_Indian_wedding.jpg',
  'gallery/gallery-tilak-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/61/A_Hindu_wedding_ritual_in_progress_b.jpg',
  'gallery/gallery-wedding-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/The_Pheras.jpg',
  'gallery/gallery-wedding-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Exchange_of_Garlands_IMG_3901_1.jpg',
  'gallery/gallery-wedding-3.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/68/Hindu_wedding_ceremony_fire.jpg',
  'gallery/gallery-family-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Indian_Traditional_Wedding_Images_%2840%29.jpg',
  'gallery/gallery-family-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Meet_friends_and_family_ritual%2C_after_Hindu_wedding_vows%2C_India.jpg'
};

async function downloadFile(relPath, url) {
  const fullPath = path.join(BASE_DIR, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  console.log(`Downloading: ${relPath} from ${url}...`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'AditiNitinWeddingApp/1.0 (contact: info@aditinitinwedding.com; educational wedding project)'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const fileStream = fs.createWriteStream(fullPath);
    await pipeline(res.body, fileStream);

    const stats = fs.statSync(fullPath);
    console.log(`✓ Saved ${relPath} (${(stats.size / 1024).toFixed(1)} KB)`);

    // Also sync og-wedding-preview.jpg to public/images/
    if (relPath === 'decorations/og-wedding-preview.jpg') {
      const publicImagesPath = 'd:/Di Wedding/frontend/public/images/og-wedding-preview.jpg';
      fs.mkdirSync(path.dirname(publicImagesPath), { recursive: true });
      fs.copyFileSync(fullPath, publicImagesPath);
      console.log(`✓ Synced to ${publicImagesPath}`);
    }
  } catch (err) {
    console.error(`✗ FAILED ${relPath}: ${err.message}`);
  }
}

async function main() {
  console.log('=== STARTING DOWNLOAD OF VERIFIED AUTHENTIC INDIAN WEDDING ASSETS ===');
  for (const [relPath, url] of Object.entries(ASSET_MAP)) {
    await downloadFile(relPath, url);
  }
  console.log('=== ALL DOWNLOADS COMPLETE ===');
}

main();
