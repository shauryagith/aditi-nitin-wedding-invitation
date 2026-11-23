import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { ENV } from '../../config/env.js';
import {
  IStorageService,
  UploadImageOptions,
  UploadAudioOptions,
  UploadResult,
  DeleteResult,
  ImageTransformOptions,
} from './storage.interface.js';

export class CloudinaryStorageService implements IStorageService {
  public readonly providerName = 'cloudinary' as const;

  constructor() {
    this.init();
  }

  private init() {
    cloudinary.config({
      cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
      api_key: ENV.CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  private sanitizeCategory(category?: string): string {
    if (!category) return 'gallery';
    return category.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  }

  /**
   * Helper to pipe buffer to Cloudinary uploader with timeout handling
   */
  private uploadBufferStream(
    buffer: Buffer,
    uploadOptions: Record<string, any>,
    timeoutMs = 25000
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      let isSettled = false;

      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          reject(new Error(`Cloudinary upload timed out after ${timeoutMs}ms`));
        }
      }, timeoutMs);

      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timer);

        if (error || !result) {
          return reject(error || new Error('Cloudinary returned empty upload response.'));
        }
        resolve(result);
      });

      const bufferStream = new Readable();
      bufferStream.push(buffer);
      bufferStream.push(null);
      bufferStream.pipe(stream);
    });
  }

  async uploadImage(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    options?: UploadImageOptions
  ): Promise<UploadResult> {
    const category = this.sanitizeCategory(options?.category);
    const folder = options?.folder || `wedding/${category}`;

    const uploadOptions: Record<string, any> = {
      folder,
      resource_type: 'image',
      tags: ['wedding', 'aditi-nitin', category, ...(options?.tags || [])],
      context: {
        alt: options?.altText || 'Aditi & Nitin Royal Wedding Asset',
        original_name: originalName,
      },
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    };

    const result = await this.uploadBufferStream(fileBuffer, uploadOptions);

    // Responsive delivery URLs
    const webpUrl = cloudinary.url(result.public_id, {
      secure: true,
      format: 'webp',
      quality: 'auto',
      fetch_format: 'auto',
    });

    const thumbnailUrl = cloudinary.url(result.public_id, {
      secure: true,
      width: 350,
      height: 350,
      crop: 'fill',
      gravity: 'auto',
      format: 'webp',
      quality: 'auto',
    });

    return {
      url: result.secure_url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      filename: `${result.public_id.split('/').pop()}.${result.format || 'webp'}`,
      originalName,
      mimeType: result.format ? `image/${result.format}` : mimeType,
      size: result.bytes || fileBuffer.length,
      width: result.width,
      height: result.height,
      format: result.format,
      thumbnailUrl,
      webpUrl,
      resourceType: 'image',
      folder,
      storageProvider: 'cloudinary',
    };
  }

  async uploadAudio(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    options?: UploadAudioOptions
  ): Promise<UploadResult> {
    const folder = options?.folder || 'wedding/music';

    // Cloudinary manages audio under the 'video' resource type
    const uploadOptions: Record<string, any> = {
      folder,
      resource_type: 'auto',
      tags: ['wedding-music', 'aditi-nitin', ...(options?.tags || [])],
      context: {
        title: options?.title || originalName,
        artist: options?.artist || 'Traditional Shehnai & Sitar',
        original_name: originalName,
      },
    };

    const result = await this.uploadBufferStream(fileBuffer, uploadOptions, 30000);

    return {
      url: result.secure_url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      filename: `${result.public_id.split('/').pop()}.${result.format || 'mp3'}`,
      originalName,
      mimeType: result.format ? `audio/${result.format}` : mimeType,
      size: result.bytes || fileBuffer.length,
      format: result.format,
      thumbnailUrl: '',
      webpUrl: '',
      resourceType: 'video',
      folder,
      storageProvider: 'cloudinary',
    };
  }

  async deleteAsset(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'image'
  ): Promise<DeleteResult> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
      });

      if (result.result === 'ok' || result.result === 'not found') {
        return { success: true, message: `Asset deleted: ${result.result}` };
      }

      return {
        success: false,
        message: `Cloudinary delete response: ${result.result}`,
      };
    } catch (err: any) {
      throw new Error(`Failed to delete Cloudinary asset (${publicId}): ${err.message}`);
    }
  }

  getTransformedUrl(
    publicIdOrUrl: string,
    options?: ImageTransformOptions
  ): string {
    // If given a full Cloudinary URL or publicId
    if (publicIdOrUrl.startsWith('http')) {
      return publicIdOrUrl;
    }

    return cloudinary.url(publicIdOrUrl, {
      secure: true,
      width: options?.width,
      height: options?.height,
      crop: options?.crop || 'scale',
      quality: options?.quality || 'auto',
      format: options?.format || 'auto',
    });
  }
}
