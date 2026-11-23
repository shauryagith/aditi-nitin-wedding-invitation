import { Request, Response } from 'express';
import { Guest } from '../models/Guest.js';
import { Event } from '../models/Event.js';
import { Gallery } from '../models/Gallery.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { MusicTrack } from '../models/MusicTrack.js';
import { QRCode } from '../models/QRCode.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { WhatsAppMessage } from '../models/WhatsAppMessage.js';
import { whatsappService } from '../services/whatsappService.js';
import { eventValidationSchema, galleryValidationSchema, rsvpValidationSchema } from '../validators/schemas.js';
import { AuthRequest } from '../middleware/auth.js';
import { socketEmitter } from '../socket/index.js';
import { CMS_EVENTS } from '../socket/events.js';

export const adminController = {
  getDashboard: async (req: Request, res: Response): Promise<void> => {
    try {
      const [
        totalRsvps,
        confirmedGuests,
        declinedGuests,
        tentativeGuests,
        guests,
        whatsappOptIns,
        totalMedia,
        totalMusic,
        totalEvents,
        totalGallery,
        totalQRs,
        recentRsvps,
        recentActivities,
      ] = await Promise.all([
        Guest.countDocuments(),
        Guest.countDocuments({ attendanceStatus: 'CONFIRMED' }),
        Guest.countDocuments({ attendanceStatus: 'DECLINED' }),
        Guest.countDocuments({ attendanceStatus: 'TENTATIVE' }),
        Guest.find({ attendanceStatus: 'CONFIRMED' }),
        Guest.countDocuments({ whatsappOptIn: true }),
        MediaAsset.countDocuments(),
        MusicTrack.countDocuments(),
        Event.countDocuments(),
        Gallery.countDocuments(),
        QRCode.countDocuments(),
        Guest.find().sort({ createdAt: -1 }).limit(10),
        ActivityLog.find().sort({ createdAt: -1 }).limit(10),
      ]);

      const expectedAttendees = guests.reduce((sum, g) => sum + (g.guestCount || 1), 0);

      res.json({
        success: true,
        data: {
          totalRsvps,
          confirmedGuests,
          declinedGuests,
          tentativeGuests,
          expectedAttendees,
          whatsappOptIns,
          totalMedia,
          totalMusic,
          totalEvents,
          totalGallery,
          totalQRs,
          recentRsvps,
          recentActivities,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getGuests: async (req: Request, res: Response): Promise<void> => {
    try {
      const { attendance, search } = req.query;
      const query: any = {};

      if (attendance && attendance !== 'ALL') {
        query.attendanceStatus = attendance;
      }

      if (search) {
        query.$or = [
          { name: { $regex: String(search), $options: 'i' } },
          { phone: { $regex: String(search), $options: 'i' } },
          { email: { $regex: String(search), $options: 'i' } },
        ];
      }

      const guests = await Guest.find(query).sort({ createdAt: -1 });
      res.json({ success: true, data: guests });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  createGuest: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const parsed = rsvpValidationSchema.parse(req.body);
      const guest = await Guest.create(parsed);

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'CREATE',
        entity: 'GUEST',
        entityId: guest._id.toString(),
        details: `Manually added RSVP for guest: ${guest.name}`,
      }).catch(() => null);

      res.status(201).json({ success: true, message: 'Guest added successfully', data: guest });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  updateGuest: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updated = await Guest.findByIdAndUpdate(id, req.body, { new: true });

      if (!updated) {
        res.status(404).json({ success: false, message: 'Guest not found' });
        return;
      }

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'UPDATE',
        entity: 'GUEST',
        entityId: id,
        details: `Updated guest details for ${updated.name}`,
      }).catch(() => null);

      res.json({ success: true, message: 'Guest updated', data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteGuest: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const guest = await Guest.findByIdAndDelete(id);

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'DELETE',
        entity: 'GUEST',
        entityId: id,
        details: `Deleted guest RSVP record: ${guest?.name || id}`,
      }).catch(() => null);

      res.json({ success: true, message: 'Guest record deleted' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  exportGuestsCSV: async (req: Request, res: Response): Promise<void> => {
    try {
      const guests = await Guest.find().sort({ createdAt: -1 });

      const headers = [
        'ID',
        'Guest Name',
        'Phone',
        'Email',
        'Guest Count',
        'Attendance Status',
        'Selected Events',
        'Dietary Preference',
        'Needs Accommodation',
        'Message',
        'Admin Notes',
        'WhatsApp Opt-In',
        'Checked In',
        'Submitted At',
      ];

      const escapeCSV = (field: any) => {
        if (field === undefined || field === null) return '""';
        const str = String(field).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = guests.map((g) => [
        escapeCSV(g._id),
        escapeCSV(g.name),
        escapeCSV(g.phone),
        escapeCSV(g.email || ''),
        escapeCSV(g.guestCount),
        escapeCSV(g.attendanceStatus),
        escapeCSV((g.selectedEvents || []).join('; ')),
        escapeCSV(g.dietaryPreference || 'VEGETARIAN'),
        escapeCSV(g.needsAccommodation ? 'Yes' : 'No'),
        escapeCSV(g.message || ''),
        escapeCSV(g.adminNotes || ''),
        escapeCSV(g.whatsappOptIn ? 'Yes' : 'No'),
        escapeCSV(g.checkedIn ? 'Yes' : 'No'),
        escapeCSV(g.createdAt.toISOString()),
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="aditi_nitin_wedding_rsvps_${new Date().toISOString().split('T')[0]}.csv"`
      );
      res.send(csvContent);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Events CRUD
  createEvent: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = eventValidationSchema.parse(req.body);
      const newEvent = await Event.create(data);

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'CREATE',
        entity: 'EVENT',
        entityId: newEvent._id.toString(),
        details: `Created wedding event: ${newEvent.title}`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.EVENT_CREATED, {
        entity: 'event',
        action: 'create',
        id: newEvent._id.toString(),
        data: newEvent,
      });

      res.status(201).json({ success: true, data: newEvent });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  updateEvent: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await Event.findByIdAndUpdate(id, data, { new: true });

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'UPDATE',
        entity: 'EVENT',
        entityId: id,
        details: `Updated event: ${updated?.title}`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.EVENT_UPDATED, {
        entity: 'event',
        action: 'update',
        id: updated?._id?.toString() || String(id),
        data: updated,
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteEvent: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const ev = await Event.findByIdAndDelete(id);

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'DELETE',
        entity: 'EVENT',
        entityId: id,
        details: `Deleted wedding event: ${ev?.title || id}`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.EVENT_DELETED, {
        entity: 'event',
        action: 'delete',
        id: String(id),
      });

      res.json({ success: true, message: 'Event deleted' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  reorderEvents: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { orderMap } = req.body; // Array of { id: string, order: number }
      if (!Array.isArray(orderMap)) {
        res.status(400).json({ success: false, message: 'orderMap must be an array' });
        return;
      }

      for (const item of orderMap) {
        await Event.findByIdAndUpdate(item.id, { order: item.order });
      }

      const events = await Event.find().sort({ order: 1 });

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.EVENT_REORDERED, {
        entity: 'event',
        action: 'reorder',
        data: events,
      });

      res.json({ success: true, message: 'Events reordered successfully', data: events });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Gallery CRUD
  createPhoto: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = galleryValidationSchema.parse(req.body);
      const photo = await Gallery.create(data);

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'CREATE',
        entity: 'GALLERY',
        entityId: photo._id.toString(),
        details: `Added photo to gallery: ${photo.title}`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.GALLERY_CREATED, {
        entity: 'gallery',
        action: 'create',
        id: photo._id.toString(),
        data: photo,
      });

      res.status(201).json({ success: true, data: photo });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  updatePhoto: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const photo = await Gallery.findByIdAndUpdate(id, req.body, { new: true });

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.GALLERY_UPDATED, {
        entity: 'gallery',
        action: 'update',
        id: photo?._id?.toString() || String(id),
        data: photo,
      });

      res.json({ success: true, data: photo });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  deletePhoto: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await Gallery.findByIdAndDelete(id);

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'DELETE',
        entity: 'GALLERY',
        entityId: id,
        details: `Deleted gallery photo id: ${id}`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.GALLERY_DELETED, {
        entity: 'gallery',
        action: 'delete',
        id: String(id),
      });

      res.json({ success: true, message: 'Photo deleted' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  reorderPhotos: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { orderMap } = req.body; // Array of { id: string, order: number }
      if (!Array.isArray(orderMap)) {
        res.status(400).json({ success: false, message: 'orderMap must be an array' });
        return;
      }

      for (const item of orderMap) {
        await Gallery.findByIdAndUpdate(item.id, { order: item.order });
      }

      const gallery = await Gallery.find().sort({ order: 1 });

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.GALLERY_REORDERED, {
        entity: 'gallery',
        action: 'reorder',
        data: gallery,
      });

      res.json({ success: true, message: 'Gallery photos reordered successfully', data: gallery });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // WhatsApp Admin APIs
  getWhatsAppMessages: async (req: Request, res: Response): Promise<void> => {
    try {
      const logs = await WhatsAppMessage.find().sort({ sentAt: -1 }).limit(50);
      res.json({ success: true, data: logs });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  sendWhatsAppReminder: async (req: Request, res: Response): Promise<void> => {
    try {
      const { guestId, templateName } = req.body;
      const guest = await Guest.findById(guestId).catch(() => null);

      if (!guest) {
        res.status(404).json({ success: false, message: 'Guest not found' });
        return;
      }

      if (!guest.whatsappOptIn) {
        res.status(400).json({
          success: false,
          message: 'Guest has not opted in for WhatsApp notifications.',
        });
        return;
      }

      const result = await whatsappService.sendTemplateMessage({
        guestId: guest._id.toString(),
        phone: guest.phone,
        templateName: templateName || 'wedding_reminder',
      });

      res.json({
        success: true,
        message: 'WhatsApp reminder processed successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  testWhatsApp: async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.body;
      if (!phone) {
        res.status(400).json({ success: false, message: 'Phone number required' });
        return;
      }

      const result = await whatsappService.sendTemplateMessage({
        phone,
        templateName: 'test_hello_world',
      });

      res.json({ success: true, message: 'Test message triggered', data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
