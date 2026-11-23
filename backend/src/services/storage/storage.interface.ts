export interface UploadImageOptions {
  folder?: string;
  category?: string;
  altText?: string;
  tags?: string[];
  transformation?: any;
}

export interface UploadAudioOptions {
  folder?: string;
  title?: string;
  artist?: string;
  tags?: string[];
}

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  format?: string;
  thumbnailUrl: string;
  webpUrl: string;
  resourceType: 'image' | 'video' | 'raw';
  folder?: string;
  storageProvider: 'cloudinary' | 'local';
}

export interface DeleteResult {
  success: boolean;
  message?: string;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
}

export interface IStorageService {
  readonly providerName: 'cloudinary' | 'local';

  uploadImage(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    options?: UploadImageOptions
  ): Promise<UploadResult>;

  uploadAudio(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    options?: UploadAudioOptions
  ): Promise<UploadResult>;

  deleteAsset(
    publicIdOrFilename: string,
    resourceType?: 'image' | 'video' | 'raw'
  ): Promise<DeleteResult>;

  getTransformedUrl(
    publicIdOrUrl: string,
    options?: ImageTransformOptions
  ): string;
}
