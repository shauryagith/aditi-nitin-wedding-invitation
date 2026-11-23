import { ENV, validateStorageConfig } from '../../config/env.js';
import { IStorageService } from './storage.interface.js';
import { CloudinaryStorageService } from './cloudinaryStorage.js';
import { LocalStorageService } from './localStorage.js';

export * from './storage.interface.js';
export { CloudinaryStorageService } from './cloudinaryStorage.js';
export { LocalStorageService } from './localStorage.js';

let activeStorageService: IStorageService;

export function getStorageService(provider?: 'cloudinary' | 'local'): IStorageService {
  const selectedProvider = provider || ENV.STORAGE_PROVIDER;

  if (selectedProvider === 'cloudinary') {
    const configCheck = validateStorageConfig();
    if (configCheck.valid) {
      return new CloudinaryStorageService();
    } else {
      console.warn(`[Storage Factory] Cloudinary configuration invalid. Using LocalStorageService.`);
      return new LocalStorageService();
    }
  }

  return new LocalStorageService();
}

/**
 * Singleton storage service instance configured based on environment
 */
export const storageService = getStorageService();
