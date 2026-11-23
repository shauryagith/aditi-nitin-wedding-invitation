import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { csrfProtection } from '../middleware/csrf.js';

const router = Router();

router.post('/login', authRateLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getMe);
router.post('/change-password', requireAuth, csrfProtection, authRateLimiter, authController.changePassword);

export default router;
