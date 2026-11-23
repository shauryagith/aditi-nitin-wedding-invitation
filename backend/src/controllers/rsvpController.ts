import { Request, Response, NextFunction } from 'express';
import { Guest } from '../models/Guest.js';
import { rsvpValidationSchema } from '../validators/schemas.js';
import { socketEmitter } from '../socket/index.js';
import { CMS_EVENTS } from '../socket/events.js';

export const rsvpController = {
  submitRsvp: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = rsvpValidationSchema.parse(req.body);

      // Normalize phone number (digits only for lookup)
      const normalizedPhone = validatedData.phone.replace(/[^0-9]/g, '');

      // Check if RSVP from this phone already exists (update instead of duplicate)
      let guest = await Guest.findOne({
        phone: { $regex: normalizedPhone.slice(-10) },
      }).catch(() => null);

      if (guest) {
        guest.name = validatedData.name;
        guest.guestCount = validatedData.guestCount;
        guest.attendanceStatus = validatedData.attendanceStatus;
        guest.selectedEvents = validatedData.selectedEvents;
        guest.message = validatedData.message;
        guest.whatsappOptIn = validatedData.whatsappOptIn;
        if (validatedData.email) guest.email = validatedData.email;
        await guest.save();
      } else {
        guest = await Guest.create({
          name: validatedData.name,
          phone: validatedData.phone,
          email: validatedData.email,
          guestCount: validatedData.guestCount,
          attendanceStatus: validatedData.attendanceStatus,
          selectedEvents: validatedData.selectedEvents,
          message: validatedData.message,
          whatsappOptIn: validatedData.whatsappOptIn,
        });
      }

      // Real-Time Notification to Admin Dashboard
      socketEmitter.emitToAdmin(CMS_EVENTS.ADMIN_RSVP_RECEIVED, {
        entity: 'rsvp',
        action: 'receive',
        id: guest._id.toString(),
        name: guest.name,
        attendanceStatus: guest.attendanceStatus,
        guestCount: guest.guestCount,
        selectedEvents: guest.selectedEvents,
        submittedAt: new Date().toISOString(),
      });

      res.status(201).json({
        success: true,
        message: 'RSVP submitted successfully! Thank you for blessing Aditi & Nitin.',
        data: {
          id: guest._id,
          name: guest.name,
          attendanceStatus: guest.attendanceStatus,
          guestCount: guest.guestCount,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
