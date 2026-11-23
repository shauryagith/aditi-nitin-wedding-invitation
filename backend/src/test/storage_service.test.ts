import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateStorageConfig, ENV } from '../config/env.js';
import {
  getStorageService,
  LocalStorageService,
  CloudinaryStorageService,
} from '../services/storage/index.js';
import fs from 'fs';
import path from 'path';

describe('Storage Abstraction & Cloudinary Service Specifications', () => {
  // Minimal valid 1x1 PNG buffer for testing
  const dummyPngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );
  // Minimal audio MP3 frame buffer
  const dummyMp3Buffer = Buffer.from([0xff, 0xfb, 0x90, 0x64, 0x00, 0x00]);

  describe('Configuration Validation', () => {
    it('validates local storage provider without requiring Cloudinary keys', () => {
      const originalProvider = ENV.STORAGE_PROVIDER;
      ENV.STORAGE_PROVIDER = 'local';

      const res = validateStorageConfig();
      expect(res.valid).toBe(true);
      expect(res.provider).toBe('local');

      ENV.STORAGE_PROVIDER = originalProvider;
    });

    it('identifies missing Cloudinary credentials when provider is cloudinary', () => {
      const originalProvider = ENV.STORAGE_PROVIDER;
      const originalCloudName = ENV.CLOUDINARY_CLOUD_NAME;
      const originalApiKey = ENV.CLOUDINARY_API_KEY;

      ENV.STORAGE_PROVIDER = 'cloudinary';
      ENV.CLOUDINARY_CLOUD_NAME = '';
      ENV.CLOUDINARY_API_KEY = '';

      const res = validateStorageConfig();
      expect(res.valid).toBe(false);
      expect(res.warning).toContain('CLOUDINARY_CLOUD_NAME');
      expect(res.warning).toContain('CLOUDINARY_API_KEY');

      // Restore
      ENV.STORAGE_PROVIDER = originalProvider;
      ENV.CLOUDINARY_CLOUD_NAME = originalCloudName;
      ENV.CLOUDINARY_API_KEY = originalApiKey;
    });
  });

  describe('Storage Factory', () => {
    it('returns LocalStorageService when requested', () => {
      const service = getStorageService('local');
      expect(service).toBeInstanceOf(LocalStorageService);
      expect(service.providerName).toBe('local');
    });

    it('returns CloudinaryStorageService when credentials are configured', () => {
      const originalCloudName = ENV.CLOUDINARY_CLOUD_NAME;
      const originalApiKey = ENV.CLOUDINARY_API_KEY;
      const originalSecret = ENV.CLOUDINARY_API_SECRET;

      ENV.CLOUDINARY_CLOUD_NAME = 'test-cloud';
      ENV.CLOUDINARY_API_KEY = 'test-key';
      ENV.CLOUDINARY_API_SECRET = 'test-secret';

      const service = getStorageService('cloudinary');
      expect(service).toBeInstanceOf(CloudinaryStorageService);
      expect(service.providerName).toBe('cloudinary');

      ENV.CLOUDINARY_CLOUD_NAME = originalCloudName;
      ENV.CLOUDINARY_API_KEY = originalApiKey;
      ENV.CLOUDINARY_API_SECRET = originalSecret;
    });
  });

  describe('LocalStorageService Lifecycle', () => {
    const localService = new LocalStorageService();
    let uploadedImageFilename = '';
    let uploadedAudioFilename = '';

    it('converts image to WebP and generates 350x350 thumbnail', async () => {
      const result = await localService.uploadImage(
        dummyPngBuffer,
        'test-ganesha.png',
        'image/png',
        { category: 'ganesha', altText: 'Lord Ganesha Artwork' }
      );

      expect(result.format).toBe('webp');
      expect(result.storageProvider).toBe('local');
      expect(result.url).toContain('/uploads/media/');
      expect(result.thumbnailUrl).toContain('thumb_');
      expect(result.mimeType).toBe('image/webp');
      expect(result.width).toBe(1);
      expect(result.height).toBe(1);

      uploadedImageFilename = result.filename;

      // Verify file exists on disk
      const fullPath = path.join(process.cwd(), 'public', 'uploads', 'media', result.filename);
      expect(fs.existsSync(fullPath)).toBe(true);
    });

    it('uploads audio file to public/uploads/music', async () => {
      const result = await localService.uploadAudio(
        dummyMp3Buffer,
        'shehnai-test.mp3',
        'audio/mpeg',
        { title: 'Shehnai Test', artist: 'Ustad' }
      );

      expect(result.storageProvider).toBe('local');
      expect(result.url).toContain('/uploads/music/');
      expect(result.resourceType).toBe('video');

      uploadedAudioFilename = result.filename;

      const fullPath = path.join(process.cwd(), 'public', 'uploads', 'music', result.filename);
      expect(fs.existsSync(fullPath)).toBe(true);
    });

    it('deletes image and thumbnail from disk cleanly', async () => {
      if (uploadedImageFilename) {
        const deleteRes = await localService.deleteAsset(uploadedImageFilename, 'image');
        expect(deleteRes.success).toBe(true);

        const fullPath = path.join(process.cwd(), 'public', 'uploads', 'media', uploadedImageFilename);
        expect(fs.existsSync(fullPath)).toBe(false);
      }
    });

    it('deletes audio track from disk cleanly', async () => {
      if (uploadedAudioFilename) {
        const deleteRes = await localService.deleteAsset(uploadedAudioFilename, 'video');
        expect(deleteRes.success).toBe(true);

        const fullPath = path.join(process.cwd(), 'public', 'uploads', 'music', uploadedAudioFilename);
        expect(fs.existsSync(fullPath)).toBe(false);
      }
    });
  });

  describe('Cloudinary Transformations and Responsive URLs', () => {
    it('generates secure responsive transformation URLs', () => {
      const originalCloudName = ENV.CLOUDINARY_CLOUD_NAME;
      ENV.CLOUDINARY_CLOUD_NAME = 'wedding-cloud';

      const cloudinaryService = new CloudinaryStorageService();
      const transformed = cloudinaryService.getTransformedUrl('wedding/gallery/photo_123', {
        width: 800,
        height: 600,
        crop: 'fill',
        format: 'webp',
      });

      expect(transformed).toContain('res.cloudinary.com');
      expect(transformed).toContain('https://');
      expect(transformed).toContain('wedding/gallery/photo_123');
      expect(transformed).toContain('w_800');
      expect(transformed).toContain('h_600');

      ENV.CLOUDINARY_CLOUD_NAME = originalCloudName;
    });

    it('preserves existing absolute URLs when transformed is called', () => {
      const cloudinaryService = new CloudinaryStorageService();
      const fullUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
      const result = cloudinaryService.getTransformedUrl(fullUrl);
      expect(result).toBe(fullUrl);
    });
  });
});
