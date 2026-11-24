import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { mediaController } from '../controllers/mediaController.js';
import { musicController } from '../controllers/musicController.js';
import { qrController } from '../controllers/qrController.js';
import { contentController } from '../controllers/contentController.js';
import { adminUserController } from '../controllers/adminUserController.js';
import { backupController } from '../controllers/backupController.js';
import { activityLogController } from '../controllers/activityLogController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { csrfProtection } from '../middleware/csrf.js';
import { uploadImage, uploadAudio } from '../middleware/upload.js';
import { uploadRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Protect all admin endpoints with authentication and CSRF middleware
router.use(requireAuth);
router.use(csrfProtection);

// 1. Dashboard & Activity Logs
router.get('/dashboard', adminController.getDashboard);
router.get('/activity-logs', requireRole('SUPER_ADMIN'), activityLogController.getLogs);

// 2. Guests & RSVP Management
router.get('/guests', adminController.getGuests);
router.get('/guests/export', requireRole('RSVP_MANAGER', 'SUPER_ADMIN'), adminController.exportGuestsCSV);
router.post('/guests', requireRole('RSVP_MANAGER', 'SUPER_ADMIN'), adminController.createGuest);
router.put('/guests/:id', requireRole('RSVP_MANAGER', 'SUPER_ADMIN'), adminController.updateGuest);
router.delete('/guests/:id', requireRole('SUPER_ADMIN'), adminController.deleteGuest);

// 3. Events Management
router.post('/events', requireRole('CONTENT_MANAGER', 'SUPER_ADMIN'), adminController.createEvent);
router.put('/events/:id', requireRole('CONTENT_MANAGER', 'SUPER_ADMIN'), adminController.updateEvent);
router.delete('/events/:id', requireRole('CONTENT_MANAGER', 'SUPER_ADMIN'), adminController.deleteEvent);
router.patch('/events/reorder', requireRole('CONTENT_MANAGER', 'SUPER_ADMIN'), adminController.reorderEvents);

// 4. Gallery Management
router.post('/gallery', requireRole('MEDIA_MANAGER', 'SUPER_ADMIN'), adminController.createPhoto);
router.put('/gallery/:id', requireRole('MEDIA_MANAGER', 'SUPER_ADMIN'), adminController.updatePhoto);
router.delete('/gallery/:id', requireRole('MEDIA_MANAGER', 'SUPER_ADMIN'), adminController.deletePhoto);
router.patch('/gallery/reorder', requireRole('MEDIA_MANAGER', 'SUPER_ADMIN'), adminController.reorderPhotos);

// 5. Media Asset Management
router.get('/media', mediaController.getMedia);
router.post(
  '/media/upload',
  requireRole('MEDIA_MANAGER', 'SUPER_ADMIN'),
  uploadRateLimiter,
  uploadImage.array('images', 10),
  mediaController.uploadMedia
);
router.put('/media/:id', requireRole('MEDIA_MANAGER', 'SUPER_ADMIN'), mediaController.updateMediaMetadata);
router.post(
  '/media/:id/replace',
  requireRole('MEDIA_MANAGER', 'SUPER_ADMIN'),
  uploadImage.single('image'),
  mediaController.replaceMedia
);
router.delete('/media/:id', requireRole('MEDIA_MANAGER', 'SUPER_ADMIN'), mediaController.deleteMedia);

// 6. Background Music Management
router.get('/music', musicController.getTracks);
router.post(
  '/music/upload',
  requireRole('MEDIA_MANAGER', 'CONTENT_MANAGER', 'ADMIN', 'SUPER_ADMIN'),
  uploadRateLimiter,
  (req, res, next) => {
    const correlationId =
      (req.headers['x-correlation-id'] as string) ||
      `music-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    (req as any).correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    console.log(`[UploadDiagnostic][${correlationId}][Stage 1: Request received] Path: /api/admin/music/upload, Method: POST`);
    console.log(`[UploadDiagnostic][${correlationId}][Stage 2: Authentication passed] Admin ID: ${(req as any).admin?.id}, Email: ${(req as any).admin?.email}`);
    console.log(`[UploadDiagnostic][${correlationId}][Stage 3: Admin authorization passed] Role: ${(req as any).admin?.role}`);
    next();
  },
  (req, res, next) => {
    uploadAudio.single('audio')(req, res, (err: any) => {
      const correlationId = (req as any).correlationId || 'unknown';
      if (err) {
        let msg = err.message || 'Multipart parsing failed';
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          msg = `Unexpected upload field "${err.field || ''}". File must be uploaded under the expected field name.`;
        } else if (err.code === 'LIMIT_FILE_SIZE') {
          msg = 'File size exceeds maximum allowed limit.';
        }
        console.error(`[UploadDiagnostic][${correlationId}][FAILED at Stage 4: Multipart parsing completed] Error: ${msg}`);
        return res.status(400).json({
          success: false,
          correlationId,
          stage: 'Stage 4: Multipart parsing completed',
          message: msg,
          code: err.code,
        });
      }
      console.log(`[UploadDiagnostic][${correlationId}][Stage 4: Multipart parsing completed] Field: audio, Size: ${req.file?.size || 0} bytes`);
      next();
    });
  },
  musicController.uploadTrack
);
router.put('/music/:id', requireRole('MEDIA_MANAGER', 'CONTENT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), musicController.updateTrack);
router.patch('/music/:id/default', requireRole('MEDIA_MANAGER', 'CONTENT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), musicController.setDefaultTrack);
router.delete('/music/:id', requireRole('MEDIA_MANAGER', 'CONTENT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), musicController.deleteTrack);

// 7. QR Code Management
router.get('/qr', qrController.getQRCodes);
router.post('/qr/generate', requireRole('RSVP_MANAGER', 'SUPER_ADMIN'), qrController.generateQR);
router.post('/qr/:id/verify', requireRole('RSVP_MANAGER', 'SUPER_ADMIN'), qrController.verifyQR);
router.delete('/qr/:id', requireRole('SUPER_ADMIN'), qrController.deleteQR);

// 8. Website Content & Appearance CMS
router.get('/content', contentController.getWeddingContent);
router.put('/content', requireRole('CONTENT_MANAGER', 'SUPER_ADMIN'), contentController.updateGeneralContent);
router.put('/content/hero', requireRole('CONTENT_MANAGER', 'SUPER_ADMIN'), contentController.updateHeroSlides);
router.put('/content/story', requireRole('CONTENT_MANAGER', 'SUPER_ADMIN'), contentController.updateStoryMilestones);
router.put('/content/family', requireRole('CONTENT_MANAGER', 'SUPER_ADMIN'), contentController.updateFamilyMembers);
router.put('/settings/appearance', requireRole('CONTENT_MANAGER', 'SUPER_ADMIN'), contentController.updateAppearance);
router.put('/settings/seo', requireRole('CONTENT_MANAGER', 'SUPER_ADMIN'), contentController.updateSeo);

// 9. Admin User Management (Super Admin only)
router.get('/users', requireRole('SUPER_ADMIN'), adminUserController.getUsers);
router.post('/users', requireRole('SUPER_ADMIN'), adminUserController.createUser);
router.put('/users/:id', requireRole('SUPER_ADMIN'), adminUserController.updateUser);
router.delete('/users/:id', requireRole('SUPER_ADMIN'), adminUserController.deleteUser);

// 10. Database Backup & Restore (Super Admin only)
router.get('/backup/export', requireRole('SUPER_ADMIN'), backupController.exportBackup);
router.post('/backup/restore', requireRole('SUPER_ADMIN'), backupController.restoreBackup);

// 11. WhatsApp Management
router.get('/whatsapp/messages', adminController.getWhatsAppMessages);
router.post('/whatsapp/send', requireRole('ADMIN', 'SUPER_ADMIN'), adminController.sendWhatsAppReminder);
router.post('/whatsapp/test', requireRole('ADMIN', 'SUPER_ADMIN'), adminController.testWhatsApp);

export default router;
