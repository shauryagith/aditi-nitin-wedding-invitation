import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// Allowed image MIME types
const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

// Allowed audio MIME types
const ALLOWED_AUDIO_MIMES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'audio/ogg',
  'audio/wav',
];

// Memory storage for images and audio so storage providers (Cloudinary/Local) can process buffers directly
const memoryStorage = multer.memoryStorage();

export const uploadImage = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum image size
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_MIMES.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Supported formats: JPEG, PNG, WebP, AVIF.'));
    }
  },
});

export const uploadAudio = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB maximum audio size for full-length wedding tracks
  },
  fileFilter: (req, file, cb) => {
    const mime = file.mimetype.toLowerCase();
    if (
      ALLOWED_AUDIO_MIMES.includes(mime) ||
      mime.startsWith('audio/') ||
      file.originalname.match(/\.(mp3|m4a|aac|ogg|wav|webm|flac|wma)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio format. Supported formats: MP3, M4A, AAC, OGG, WAV, WEBM, FLAC.'));
    }
  },
});
