import { Router } from 'express';
import { weddingController } from '../controllers/weddingController.js';
import { musicController } from '../controllers/musicController.js';
import { qrController } from '../controllers/qrController.js';
import { qrRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Ensure dynamic endpoints are never aggressively cached by browsers/proxies
router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Core public wedding details
router.get('/wedding', weddingController.getWeddingDetails);
router.get('/events', weddingController.getEvents);
router.get('/gallery', weddingController.getGallery);
router.get('/sync-status', weddingController.getSyncStatus);

// Public background music stream
router.get('/music', musicController.getActiveTrack);

// Public rate-limited QR code access
router.get('/qr/public/:type', qrRateLimiter, qrController.getPublicQR);

export default router;
