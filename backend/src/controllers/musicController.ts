import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { MusicTrack } from '../models/MusicTrack.js';
import { Wedding } from '../models/Wedding.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AuthRequest } from '../middleware/auth.js';
import { musicTrackSchema } from '../validators/schemas.js';
import { storageService } from '../services/storage/index.js';
import { socketEmitter } from '../socket/index.js';
import { CMS_EVENTS } from '../socket/events.js';

export const musicController = {
  getTracks: async (req: Request, res: Response): Promise<void> => {
    try {
      const tracks = await MusicTrack.find().sort({ order: 1, createdAt: -1 });
      res.json({ success: true, data: tracks });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getActiveTrack: async (req: Request, res: Response): Promise<void> => {
    try {
      let track = null;
      if (mongoose.connection.readyState === 1) {
        track = await MusicTrack.findOne({ isActive: true, isDefault: true }).catch(() => null);
        if (!track) {
          track = await MusicTrack.findOne({ isActive: true }).sort({ order: 1 }).catch(() => null);
        }
      }

      if (!track) {
        // Fallback default royal shehnai track
        res.json({
          success: true,
          data: {
            title: 'Royal Wedding Shehnai & Sitar Melody',
            artist: 'Traditional Indian Wedding Instrumental',
            fileUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65955635.mp3',
            secureUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65955635.mp3',
            volume: 0.5,
            loop: true,
          },
        });
        return;
      }

      res.json({ success: true, data: track });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  uploadTrack: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ success: false, message: 'Audio file is required.' });
        return;
      }

      const title = req.body.title || path.parse(file.originalname).name;
      const artist = req.body.artist || 'Traditional Shehnai & Sitar';
      const volume = req.body.volume !== undefined ? parseFloat(req.body.volume) : 0.5;
      const loop = req.body.loop !== undefined ? req.body.loop === 'true' || req.body.loop === true : true;
      const isDefault = req.body.isDefault === 'true' || req.body.isDefault === true;

      const uploadResult = await storageService.uploadAudio(file.buffer, file.originalname, file.mimetype, {
        title,
        artist,
        folder: 'wedding/music',
      });

      if (isDefault) {
        await MusicTrack.updateMany({}, { isDefault: false });
        await Wedding.findOneAndUpdate(
          {},
          { $set: { 'websiteSettings.musicUrl': uploadResult.secureUrl } }
        ).catch(() => null);
      }

      const track = await MusicTrack.create({
        title,
        artist,
        fileUrl: uploadResult.url,
        secureUrl: uploadResult.secureUrl,
        publicId: uploadResult.publicId,
        storageProvider: uploadResult.storageProvider,
        resourceType: uploadResult.resourceType,
        format: uploadResult.format,
        originalName: file.originalname,
        fileSize: uploadResult.size,
        volume,
        loop,
        isDefault,
        isActive: true,
      });

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'CREATE',
        entity: 'MUSIC',
        entityId: track._id.toString(),
        details: `Uploaded music track: ${track.title} (${track.artist}) via ${storageService.providerName}`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.MUSIC_UPDATED, {
        entity: 'music',
        action: 'create',
        id: track._id.toString(),
        data: track,
      });

      res.status(201).json({
        success: true,
        message: `Background music uploaded successfully via ${storageService.providerName}`,
        data: track,
      });
    } catch (err) {
      next(err);
    }
  },

  updateTrack: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, artist, volume, loop, isActive } = req.body;

      const track = await MusicTrack.findById(id);
      if (!track) {
        res.status(404).json({ success: false, message: 'Track not found' });
        return;
      }

      if (title) track.title = title;
      if (artist) track.artist = artist;
      if (volume !== undefined) track.volume = Math.max(0.0, Math.min(1.0, parseFloat(volume)));
      if (loop !== undefined) track.loop = loop;
      if (isActive !== undefined) track.isActive = isActive;

      await track.save();

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.MUSIC_UPDATED, {
        entity: 'music',
        action: 'update',
        id: track._id.toString(),
        data: track,
      });

      res.json({ success: true, message: 'Track settings updated', data: track });
    } catch (err) {
      next(err);
    }
  },

  setDefaultTrack: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await MusicTrack.updateMany({}, { isDefault: false });
      const track = await MusicTrack.findByIdAndUpdate(id, { isDefault: true, isActive: true }, { new: true });

      if (!track) {
        res.status(404).json({ success: false, message: 'Track not found' });
        return;
      }

      await Wedding.findOneAndUpdate(
        {},
        { $set: { 'websiteSettings.musicUrl': track.secureUrl || track.fileUrl } }
      ).catch(() => null);

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'UPDATE',
        entity: 'MUSIC',
        entityId: id,
        details: `Set ${track.title} as default wedding music`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.MUSIC_UPDATED, {
        entity: 'music',
        action: 'update',
        id: track._id.toString(),
        data: track,
      });

      res.json({ success: true, message: 'Default track updated', data: track });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  deleteTrack: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const track = await MusicTrack.findById(id);

      if (!track) {
        res.status(404).json({ success: false, message: 'Track not found' });
        return;
      }

      if (track.isDefault) {
        const nextTrack = await MusicTrack.findOne({ _id: { $ne: id }, isActive: true }).sort({ createdAt: -1 });
        if (nextTrack) {
          nextTrack.isDefault = true;
          await nextTrack.save();
          await Wedding.findOneAndUpdate(
            {},
            { $set: { 'websiteSettings.musicUrl': nextTrack.secureUrl || nextTrack.fileUrl } }
          ).catch(() => null);
        } else {
          await Wedding.findOneAndUpdate(
            {},
            { $set: { 'websiteSettings.musicUrl': 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65955635.mp3' } }
          ).catch(() => null);
        }
      }

      // Delete from storage provider
      await storageService.deleteAsset(track.publicId || track.fileUrl, 'video').catch(() => null);

      await MusicTrack.findByIdAndDelete(id);

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'DELETE',
        entity: 'MUSIC',
        entityId: id,
        details: `Deleted music track: ${track.title}`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.MUSIC_UPDATED, {
        entity: 'music',
        action: 'delete',
        id: String(id),
      });

      res.json({ success: true, message: 'Music track deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
