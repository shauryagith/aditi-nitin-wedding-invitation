import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { ENV } from '../config/env.js';
import { loginValidationSchema, changePasswordSchema } from '../validators/schemas.js';
import { AuthRequest } from '../middleware/auth.js';

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = loginValidationSchema.parse(req.body);
      const normalizedEmail = email.toLowerCase().trim();

      const admin = await Admin.findOne({ email: normalizedEmail });

      if (!admin) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      if (!admin.isActive) {
        res.status(403).json({ success: false, message: 'Account is deactivated. Contact Super Admin.' });
        return;
      }

      // Check account lockout
      if (admin.lockUntil && admin.lockUntil > new Date()) {
        const remainingMinutes = Math.ceil((admin.lockUntil.getTime() - Date.now()) / (60 * 1000));
        res.status(429).json({
          success: false,
          message: `Account is temporarily locked due to excessive failed attempts. Try again in ${remainingMinutes} minute(s).`,
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash);

      if (!isMatch) {
        admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;
        if (admin.failedLoginAttempts >= 5) {
          admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute lockout
        }
        await admin.save();

        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      // Successful login: reset failed attempts, update lastLoginAt
      admin.failedLoginAttempts = 0;
      admin.lockUntil = undefined;
      admin.lastLoginAt = new Date();
      await admin.save();

      // Sign JWT
      const token = jwt.sign(
        { id: admin._id.toString(), email: admin.email, role: admin.role },
        ENV.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set cookie
      res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Audit Log
      await ActivityLog.create({
        adminId: admin._id.toString(),
        adminEmail: admin.email,
        action: 'LOGIN',
        entity: 'AUTH',
        entityId: admin._id.toString(),
        details: `Admin ${admin.name} logged in successfully`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.get('user-agent') || 'Unknown',
      }).catch(() => null);

      res.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('jwt_token');
    res.json({ success: true, message: 'Logged out successfully' });
  },

  getMe: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.admin) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const admin = await Admin.findById(req.admin.id).select('-passwordHash');
      if (!admin) {
        res.status(404).json({ success: false, message: 'Admin account not found' });
        return;
      }

      res.json({
        success: true,
        data: {
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            lastLoginAt: admin.lastLoginAt,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  changePassword: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.admin) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      const admin = await Admin.findById(req.admin.id);

      if (!admin) {
        res.status(404).json({ success: false, message: 'Admin not found' });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Current password does not match' });
        return;
      }

      admin.passwordHash = await bcrypt.hash(newPassword, 10);
      await admin.save();

      await ActivityLog.create({
        adminId: admin._id.toString(),
        adminEmail: admin.email,
        action: 'UPDATE',
        entity: 'AUTH',
        entityId: admin._id.toString(),
        details: `Admin ${admin.name} changed their password`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.get('user-agent') || 'Unknown',
      }).catch(() => null);

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
      next(err);
    }
  },
};
