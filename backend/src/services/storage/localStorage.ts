import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import {
  IStorageService,
  UploadImageOptions,
  UploadAudioOptions,
  UploadResult,
  DeleteResult,
  ImageTransformOptions,
} from './storage.interface.js';

export class LocalStorageService implements IStorageService {
  public readonly providerName = 'local' as const;

  private mediaDir: string;
  private musicDir: string;

  constructor() {
    this.mediaDir = path.join(process.cwd(), 'public', 'uploads', 'media');
    this.musicDir = path.join(process.cwd(), 'public', 'uploads', 'music');

    if (!fs.existsSync(this.mediaDir)) {
      fs.mkdirSync(this.mediaDir, { recursive: true });
    }
    if (!fs.existsSync(this.musicDir)) {
      fs.mkdirSync(this.musicDir, { recursive: true });
    }
  }

  async uploadImage(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    options?: UploadImageOptions
  ): Promise<UploadResult> {
    const fileId = crypto.randomBytes(8).toString('hex');
    const filename = `media_${Date.now()}_${fileId}.webp`;
    const thumbFilename = `thumb_${fileId}.webp`;

    const outputPath = path.join(this.mediaDir, filename);
    const thumbPath = path.join(this.mediaDir, thumbFilename);

    // High quality WebP
    const image = sharp(fileBuffer);
    const metadata = await image.metadata();

    await image.webp({ quality: 85, effort: 4 }).toFile(outputPath);

    // 350x350 WebP Thumbnail
    await sharp(fileBuffer)
      .resize({ width: 350, height: 350, fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(thumbPath);

    const relativeUrl = `/uploads/media/${filename}`;
    const relativeThumbUrl = `/uploads/media/${thumbFilename}`;

    return {
      url: relativeUrl,
      secureUrl: relativeUrl,
      publicId: filename,
      filename,
      originalName,
      mimeType: 'image/webp',
      size: fileBuffer.length,
      width: metadata.width || 800,
      height: metadata.height || 600,
      format: 'webp',
      thumbnailUrl: relativeThumbUrl,
      webpUrl: relativeUrl,
      resourceType: 'image',
      folder: options?.folder || `wedding/${options?.category || 'gallery'}`,
      storageProvider: 'local',
    };
  }

  async uploadAudio(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    options?: UploadAudioOptions
  ): Promise<UploadResult> {
    const ext = path.extname(originalName).toLowerCase() || '.mp3';
    const filename = `track_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`;
    const outputPath = path.join(this.musicDir, filename);

    await fs.promises.writeFile(outputPath, fileBuffer);

    const relativeUrl = `/uploads/music/${filename}`;

    return {
      url: relativeUrl,
      secureUrl: relativeUrl,
      publicId: filename,
      filename,
      originalName,
      mimeType: mimeType || 'audio/mpeg',
      size: fileBuffer.length,
      format: ext.replace('.', ''),
      thumbnailUrl: '',
      webpUrl: '',
      resourceType: 'video',
      folder: 'wedding/music',
      storageProvider: 'local',
    };
  }

  async deleteAsset(
    filename: string,
    resourceType: 'image' | 'video' | 'raw' = 'image'
  ): Promise<DeleteResult> {
    try {
      const cleanName = path.basename(filename);

      if (resourceType === 'image') {
        const filePath = path.join(this.mediaDir, cleanName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Try deleting thumbnail if cleanName was original
        const thumbName = cleanName.startsWith('media_')
          ? cleanName.replace(/^media_/, 'thumb_')
          : `thumb_${cleanName}`;
        const thumbPath = path.join(this.mediaDir, thumbName);
        if (fs.existsSync(thumbPath)) {
          fs.unlinkSync(thumbPath);
        }
      } else {
        const filePath = path.join(this.musicDir, cleanName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return { success: true, message: `Local asset ${cleanName} removed` };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  getTransformedUrl(publicIdOrUrl: string, options?: ImageTransformOptions): string {
    return publicIdOrUrl;
  }
}
