import { Request, Response, NextFunction } from 'express';
import { MediaAsset } from '../models/MediaAsset.js';
import { Wedding } from '../models/Wedding.js';
import { Event } from '../models/Event.js';
import { Gallery } from '../models/Gallery.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AuthRequest } from '../middleware/auth.js';
import { mediaMetadataSchema } from '../validators/schemas.js';
import { storageService } from '../services/storage/index.js';
import { socketEmitter } from '../socket/index.js';
import { CMS_EVENTS } from '../socket/events.js';

export const mediaController = {
  getMedia: async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, section, search } = req.query;
      const query: any = {};

      if (category && category !== 'ALL') {
        query.category = category;
      }

      if (section) {
        query.sectionPlacement = section;
      }

      if (search) {
        query.$or = [
          { originalName: { $regex: String(search), $options: 'i' } },
          { altText: { $regex: String(search), $options: 'i' } },
          { caption: { $regex: String(search), $options: 'i' } },
        ];
      }

      const assets = await MediaAsset.find(query).sort({ order: 1, createdAt: -1 });
      res.json({ success: true, data: assets });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  uploadMedia: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const file = req.file as Express.Multer.File | undefined;

      const fileList = files && files.length > 0 ? files : file ? [file] : [];

      if (fileList.length === 0) {
        res.status(400).json({ success: false, message: 'No image files provided for upload.' });
        return;
      }

      const category = (req.body.category || 'gallery') as any;
      const altText = req.body.altText || 'Aditi & Nitin Royal Wedding Asset';
      const sectionPlacement = req.body.sectionPlacement || '';

      const uploadedAssets = [];

      for (const f of fileList) {
        const uploadResult = await storageService.uploadImage(f.buffer, f.originalname, f.mimetype, {
          category,
          altText,
          folder: `wedding/${category}`,
        });

        const asset = await MediaAsset.create({
          filename: uploadResult.filename,
          originalName: uploadResult.originalName,
          mimeType: uploadResult.mimeType,
          size: uploadResult.size,
          width: uploadResult.width || 800,
          height: uploadResult.height || 600,
          url: uploadResult.url,
          secureUrl: uploadResult.secureUrl,
          webpUrl: uploadResult.webpUrl,
          thumbnailUrl: uploadResult.thumbnailUrl,
          publicId: uploadResult.publicId,
          storageProvider: uploadResult.storageProvider,
          folder: uploadResult.folder,
          format: uploadResult.format,
          resourceType: uploadResult.resourceType,
          category,
          sectionPlacement,
          altText,
          focalPoint: { x: 50, y: 50 },
          isDesktop: true,
          isMobile: true,
          order: 1,
        });

        uploadedAssets.push(asset);
      }

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'CREATE',
        entity: 'MEDIA',
        details: `Uploaded ${uploadedAssets.length} image asset(s) to ${storageService.providerName} under category ${category}`,
        ipAddress: req.ip || '127.0.0.1',
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.MEDIA_UPLOADED, {
        entity: 'media',
        action: 'create',
        data: uploadedAssets,
      });

      res.status(201).json({
        success: true,
        message: `Successfully uploaded ${uploadedAssets.length} image(s) via ${storageService.providerName}.`,
        data: uploadedAssets,
      });
    } catch (err) {
      next(err);
    }
  },

  updateMediaMetadata: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const parsed = mediaMetadataSchema.partial().parse(req.body);

      const asset = await MediaAsset.findById(id);
      if (!asset) {
        res.status(404).json({ success: false, message: 'Media asset not found' });
        return;
      }

      if (parsed.category) asset.category = parsed.category;
      if (parsed.sectionPlacement !== undefined) asset.sectionPlacement = parsed.sectionPlacement;
      if (parsed.altText) asset.altText = parsed.altText;
      if (parsed.caption !== undefined) asset.caption = parsed.caption;
      if (parsed.description !== undefined) asset.description = parsed.description;
      if (parsed.focalPointX !== undefined) asset.focalPoint.x = parsed.focalPointX;
      if (parsed.focalPointY !== undefined) asset.focalPoint.y = parsed.focalPointY;
      if (parsed.isDesktop !== undefined) asset.isDesktop = parsed.isDesktop;
      if (parsed.isMobile !== undefined) asset.isMobile = parsed.isMobile;
      if (parsed.order !== undefined) asset.order = parsed.order;

      await asset.save();

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.MEDIA_UPDATED, {
        entity: 'media',
        action: 'update',
        id: asset._id.toString(),
        data: asset,
      });

      res.json({ success: true, message: 'Media metadata updated', data: asset });
    } catch (err) {
      next(err);
    }
  },

  replaceMedia: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        res.status(400).json({ success: false, message: 'Replacement image file required.' });
        return;
      }

      const asset = await MediaAsset.findById(id);
      if (!asset) {
        res.status(404).json({ success: false, message: 'Media asset not found.' });
        return;
      }

      // Cleanup old asset from storage provider
      await storageService.deleteAsset(asset.publicId || asset.filename, 'image').catch(() => null);

      // Upload replacement image
      const uploadResult = await storageService.uploadImage(file.buffer, file.originalname, file.mimetype, {
        category: asset.category,
        altText: asset.altText,
        folder: asset.folder || `wedding/${asset.category}`,
      });

      asset.filename = uploadResult.filename;
      asset.originalName = uploadResult.originalName;
      asset.mimeType = uploadResult.mimeType;
      asset.size = uploadResult.size;
      asset.width = uploadResult.width || 800;
      asset.height = uploadResult.height || 600;
      asset.url = uploadResult.url;
      asset.secureUrl = uploadResult.secureUrl;
      asset.webpUrl = uploadResult.webpUrl;
      asset.thumbnailUrl = uploadResult.thumbnailUrl;
      asset.publicId = uploadResult.publicId;
      asset.storageProvider = uploadResult.storageProvider;
      asset.format = uploadResult.format;

      await asset.save();

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'UPDATE',
        entity: 'MEDIA',
        entityId: asset._id.toString(),
        details: `Replaced image for asset ${asset.originalName} via ${storageService.providerName}`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.MEDIA_UPDATED, {
        entity: 'media',
        action: 'update',
        id: asset._id.toString(),
        data: asset,
      });

      res.json({ success: true, message: 'Media asset replaced successfully', data: asset });
    } catch (err) {
      next(err);
    }
  },

  deleteMedia: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const asset = await MediaAsset.findById(id);

      if (!asset) {
        res.status(404).json({ success: false, message: 'Media asset not found' });
        return;
      }

      // Referential integrity check across Wedding content, Events, and Gallery
      const urlsToCheck = [
        asset.url,
        asset.secureUrl,
        asset.webpUrl,
        asset.thumbnailUrl,
        asset.filename,
        asset.publicId,
      ].filter(Boolean) as string[];

      const blockingReferences: string[] = [];

      // Check Wedding Content
      const wedding = await Wedding.findOne().catch(() => null);
      if (wedding) {
        if (wedding.brideImage && urlsToCheck.includes(wedding.brideImage)) {
          blockingReferences.push('Bride Portrait');
        }
        if (wedding.groomImage && urlsToCheck.includes(wedding.groomImage)) {
          blockingReferences.push('Groom Portrait');
        }
        if (wedding.heroSlides && wedding.heroSlides.length > 0) {
          wedding.heroSlides.forEach((slide, idx) => {
            if (
              urlsToCheck.includes(slide.desktopImage) ||
              (slide.mobileImage && urlsToCheck.includes(slide.mobileImage))
            ) {
              blockingReferences.push(`Hero Slide #${idx + 1} ("${slide.title || 'Slide'}")`);
            }
          });
        }
        if (wedding.storyMilestones && wedding.storyMilestones.length > 0) {
          wedding.storyMilestones.forEach((m, idx) => {
            if (m.image && urlsToCheck.includes(m.image)) {
              blockingReferences.push(`Story Milestone #${idx + 1} ("${m.title}")`);
            }
          });
        }
        if (wedding.familyMembers && wedding.familyMembers.length > 0) {
          wedding.familyMembers.forEach((f) => {
            if (f.image && urlsToCheck.includes(f.image)) {
              blockingReferences.push(`Family Member ("${f.name}")`);
            }
          });
        }
      }

      // Check Wedding Events
      const referencingEvent = await Event.findOne({
        image: { $in: urlsToCheck },
      }).catch(() => null);
      if (referencingEvent) {
        blockingReferences.push(`Event ("${referencingEvent.title}")`);
      }

      // Check Gallery Photos
      const referencingGallery = await Gallery.findOne({
        $or: [
          { imageUrl: { $in: urlsToCheck } },
          { thumbnailUrl: { $in: urlsToCheck } },
        ],
      }).catch(() => null);
      if (referencingGallery) {
        blockingReferences.push(`Gallery Photo ("${referencingGallery.title}")`);
      }

      if (blockingReferences.length > 0) {
        res.status(400).json({
          success: false,
          message: `Cannot delete asset "${asset.originalName}". It is currently referenced in: ${blockingReferences.join(', ')}. Please update or remove the reference before deleting this asset.`,
        });
        return;
      }

      // Perform deletion from storage provider
      await storageService.deleteAsset(asset.publicId || asset.filename, 'image');

      // Delete from database
      await MediaAsset.findByIdAndDelete(id);

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'DELETE',
        entity: 'MEDIA',
        entityId: id,
        details: `Deleted media asset: ${asset.originalName}`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.MEDIA_DELETED, {
        entity: 'media',
        action: 'delete',
        id: String(id),
      });

      res.json({ success: true, message: 'Media asset deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
