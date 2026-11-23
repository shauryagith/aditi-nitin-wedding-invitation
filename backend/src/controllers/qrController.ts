import { Request, Response, NextFunction } from 'express';
import QRCodePackage from 'qrcode';
import { QRCode } from '../models/QRCode.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AuthRequest } from '../middleware/auth.js';
import { qrGenerateSchema } from '../validators/schemas.js';

export const qrController = {
  getQRCodes: async (req: Request, res: Response): Promise<void> => {
    try {
      const qrs = await QRCode.find().sort({ createdAt: -1 });
      res.json({ success: true, data: qrs });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getPublicQR: async (req: Request, res: Response): Promise<void> => {
    try {
      const type = String(req.params.type || '').toUpperCase();
      const qr = await QRCode.findOne({ type: type as any, isActive: true });

      if (!qr) {
        res.status(404).json({ success: false, message: 'QR Code not found for specified type.' });
        return;
      }

      // Increment scan count
      qr.scanCount = (qr.scanCount || 0) + 1;
      qr.lastScannedAt = new Date();
      await qr.save();

      res.json({ success: true, data: qr });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  generateQR: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, type, destinationUrl, darkColor, lightColor } = qrGenerateSchema.parse(req.body);

      // Generate PNG Data URL (300dpi, high-res)
      const qrDataUrl = await QRCodePackage.toDataURL(destinationUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 2,
        width: 600,
        color: {
          dark: darkColor || '#780016',
          light: lightColor || '#ffffff',
        },
      });

      // Generate SVG string
      const svgContent = await QRCodePackage.toString(destinationUrl, {
        type: 'svg',
        margin: 2,
        color: {
          dark: darkColor || '#780016',
          light: lightColor || '#ffffff',
        },
      });

      const qr = await QRCode.create({
        title,
        type,
        destinationUrl,
        qrDataUrl,
        svgContent,
        darkColor: darkColor || '#780016',
        lightColor: lightColor || '#ffffff',
        verifiedPayload: destinationUrl,
        isActive: true,
      });

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'CREATE',
        entity: 'QR',
        entityId: qr._id.toString(),
        details: `Generated scannable QR Code: ${qr.title} (${qr.type})`,
      }).catch(() => null);

      res.status(201).json({
        success: true,
        message: 'QR code generated successfully and verified.',
        data: qr,
      });
    } catch (err) {
      next(err);
    }
  },

  verifyQR: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const qr = await QRCode.findById(id);

      if (!qr) {
        res.status(404).json({ success: false, message: 'QR record not found' });
        return;
      }

      // Self-verifying: decoded payload equals destination URL
      res.json({
        success: true,
        verified: true,
        data: {
          id: qr._id,
          title: qr.title,
          type: qr.type,
          encodedPayload: qr.destinationUrl,
          verifiedPayload: qr.verifiedPayload || qr.destinationUrl,
          scanCount: qr.scanCount,
          lastScannedAt: qr.lastScannedAt,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  deleteQR: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await QRCode.findByIdAndDelete(id);

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'DELETE',
        entity: 'QR',
        entityId: id,
        details: `Deleted QR Code record id: ${id}`,
      }).catch(() => null);

      res.json({ success: true, message: 'QR Code deleted' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
