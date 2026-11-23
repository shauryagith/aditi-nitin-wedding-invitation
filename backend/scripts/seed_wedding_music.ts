import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { ENV } from '../src/config/env.js';
import { MusicTrack } from '../src/models/MusicTrack.js';
import { storageService } from '../src/services/storage/index.js';

async function seedMusic() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(ENV.MONGODB_URI);

  const audioPath = path.resolve('frontend/public/music/royal-wedding-shehnai.wav');
  if (!fs.existsSync(audioPath)) {
    throw new Error(`Audio file not found at ${audioPath}`);
  }

  const audioBuffer = fs.readFileSync(audioPath);
  console.log(`Uploading ${audioBuffer.length} bytes to Cloudinary under wedding/music...`);

  let secureUrl = '/music/royal-wedding-shehnai.wav';
  let publicId = 'wedding/music/royal_wedding_shehnai';

  try {
    const uploadResult = await storageService.uploadAudio(
      audioBuffer,
      'royal-wedding-shehnai.wav',
      'audio/wav',
      {
        title: 'Mangalyam Tantunanena (Shehnai & Sitar Traditional)',
        artist: 'Royal Indian Wedding Symphony',
        folder: 'wedding/music',
      }
    );
    secureUrl = uploadResult.secureUrl || uploadResult.url;
    publicId = uploadResult.publicId || publicId;
    console.log(`Successfully uploaded to Cloudinary: ${secureUrl}`);
  } catch (err: any) {
    console.warn(`Cloudinary audio upload fallback: ${err.message}. Using local path.`);
  }

  // Clear previous default tracks
  await MusicTrack.updateMany({}, { isDefault: false });

  // Update or create active default track
  const track = await MusicTrack.findOneAndUpdate(
    { title: 'Mangalyam Tantunanena (Shehnai & Sitar Traditional)' },
    {
      title: 'Mangalyam Tantunanena (Shehnai & Sitar Traditional)',
      artist: 'Royal Indian Wedding Symphony',
      fileUrl: secureUrl,
      secureUrl: secureUrl,
      publicId: publicId,
      storageProvider: secureUrl.includes('cloudinary') ? 'cloudinary' : 'local',
      originalName: 'royal-wedding-shehnai.wav',
      fileSize: audioBuffer.length,
      volume: 0.65,
      loop: true,
      isDefault: true,
      isActive: true,
      order: 1,
    },
    { upsert: true, new: true }
  );

  console.log('Default MusicTrack in Database:', track);
  await mongoose.disconnect();
  console.log('Seed completed successfully.');
}

seedMusic().catch((err) => {
  console.error('Seed music error:', err);
  process.exit(1);
});
