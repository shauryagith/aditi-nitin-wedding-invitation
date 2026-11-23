import { Router } from 'express';
import { rsvpController } from '../controllers/rsvpController.js';
import { rsvpRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/rsvp', rsvpRateLimiter, rsvpController.submitRsvp);

export default router;
