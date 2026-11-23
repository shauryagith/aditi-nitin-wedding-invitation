import { Request, Response } from 'express';
import { Admin } from '../models/Admin.js';
import { Wedding } from '../models/Wedding.js';
import { Event } from '../models/Event.js';
import { Gallery } from '../models/Gallery.js';
import { Guest } from '../models/Guest.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { MusicTrack } from '../models/MusicTrack.js';
import { QRCode } from '../models/QRCode.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AuthRequest } from '../middleware/auth.js';

export const backupController = {
  exportBackup: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const [
        wedding,
        events,
        gallery,
        guests,
        media,
        music,
        qrCodes,
        logs,
      ] = await Promise.all([
        Wedding.findOne().lean(),
        Event.find().lean(),
        Gallery.find().lean(),
        Guest.find().lean(),
        MediaAsset.find().lean(),
        MusicTrack.find().lean(),
        QRCode.find().lean(),
        ActivityLog.find().sort({ createdAt: -1 }).limit(500).lean(),
      ]);

      const backupData = {
        meta: {
          version: '2.0.0',
          wedding: 'Aditi & Nitin Royal Wedding',
          exportedAt: new Date().toISOString(),
          exportedBy: req.admin?.email || 'admin@aditinitinwedding.com',
          counts: {
            events: events.length,
            gallery: gallery.length,
            guests: guests.length,
            media: media.length,
            music: music.length,
            qrCodes: qrCodes.length,
            logs: logs.length,
          },
        },
        data: {
          wedding,
          events,
          gallery,
          guests,
          media,
          music,
          qrCodes,
        },
      };

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'EXPORT',
        entity: 'BACKUP',
        details: `Exported full database backup (${guests.length} guests, ${media.length} media assets)`,
      }).catch(() => null);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="wedding_backup_${new Date().toISOString().split('T')[0]}.json"`
      );
      res.json(backupData);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  restoreBackup: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const backup = req.body;

      if (!backup || !backup.data) {
        res.status(400).json({ success: false, message: 'Invalid backup file structure.' });
        return;
      }

      const { wedding, events, gallery, guests, media, music, qrCodes } = backup.data;

      // Restore wedding settings
      if (wedding) {
        await Wedding.deleteMany({});
        delete wedding._id;
        await Wedding.create(wedding);
      }

      // Restore events
      if (Array.isArray(events) && events.length > 0) {
        await Event.deleteMany({});
        const cleaned = events.map((e: any) => {
          const copy = { ...e };
          delete copy._id;
          return copy;
        });
        await Event.insertMany(cleaned);
      }

      // Restore guests
      if (Array.isArray(guests) && guests.length > 0) {
        await Guest.deleteMany({});
        const cleaned = guests.map((g: any) => {
          const copy = { ...g };
          delete copy._id;
          return copy;
        });
        await Guest.insertMany(cleaned);
      }

      // Restore media
      if (Array.isArray(media) && media.length > 0) {
        await MediaAsset.deleteMany({});
        const cleaned = media.map((m: any) => {
          const copy = { ...m };
          delete copy._id;
          return copy;
        });
        await MediaAsset.insertMany(cleaned);
      }

      // Restore music
      if (Array.isArray(music) && music.length > 0) {
        await MusicTrack.deleteMany({});
        const cleaned = music.map((m: any) => {
          const copy = { ...m };
          delete copy._id;
          return copy;
        });
        await MusicTrack.insertMany(cleaned);
      }

      // Restore QR
      if (Array.isArray(qrCodes) && qrCodes.length > 0) {
        await QRCode.deleteMany({});
        const cleaned = qrCodes.map((q: any) => {
          const copy = { ...q };
          delete copy._id;
          return copy;
        });
        await QRCode.insertMany(cleaned);
      }

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'RESTORE',
        entity: 'BACKUP',
        details: 'Database restored from JSON backup archive',
      }).catch(() => null);

      res.json({ success: true, message: 'Database restored successfully from backup.' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
