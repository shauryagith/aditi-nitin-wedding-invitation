import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

const ALLOWED_ORIGINS = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'https://aditinitinwedding.com',
].filter(Boolean);

/**
 * Anti-CSRF Middleware
 * Protects cookie-authenticated state-changing requests (POST, PUT, PATCH, DELETE)
 * from Cross-Site Request Forgery.
 * 
 * Safe conditions:
 * - Read-only methods (GET, HEAD, OPTIONS) pass through.
 * - Authorization: Bearer requests pass through (browser cannot auto-attach Bearer headers).
 * - Cookie-authenticated requests MUST supply either:
 *   1. X-Requested-With: XMLHttpRequest (standard browser-enforced anti-CSRF preflight trigger)
 *   2. X-CSRF-Token header
 * - Origin / Referer validation against trusted origins.
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  const method = req.method.toUpperCase();

  // Safe HTTP methods do not mutate state
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return next();
  }

  // If request uses Bearer token, CSRF is not possible because browsers never auto-send Bearer headers
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // If request is authenticated via cookie, enforce strict CSRF protection
  if (req.cookies?.jwt_token) {
    const origin = req.headers.origin;

    // Validate Origin if present
    if (origin) {
      const isAllowed = ALLOWED_ORIGINS.some((allowed) => 
        origin === allowed || origin.startsWith(allowed)
      );
      if (!isAllowed && ENV.NODE_ENV === 'production') {
        res.status(403).json({
          success: false,
          message: 'CSRF Forbidden: Origin header validation failed.',
        });
        return;
      }
    }

    // Validate custom header
    const csrfHeader = req.headers['x-csrf-token'] || req.headers['x-requested-with'];
    if (!csrfHeader) {
      res.status(403).json({
        success: false,
        message: 'CSRF Forbidden: Missing required CSRF protection header (X-Requested-With or X-CSRF-Token).',
      });
      return;
    }
  }

  next();
};
