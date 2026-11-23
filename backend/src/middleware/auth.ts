import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { Admin, AdminRole } from '../models/Admin.js';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: AdminRole;
  };
}

export const ROLE_HIERARCHY: Record<AdminRole, AdminRole[]> = {
  SUPER_ADMIN: [
    'SUPER_ADMIN',
    'ADMIN',
    'EDITOR',
    'VIEWER',
    'CONTENT_MANAGER',
    'MEDIA_MANAGER',
    'RSVP_MANAGER',
    'COORDINATOR',
  ],
  ADMIN: [
    'ADMIN',
    'EDITOR',
    'VIEWER',
    'CONTENT_MANAGER',
    'MEDIA_MANAGER',
    'RSVP_MANAGER',
    'COORDINATOR',
  ],
  EDITOR: ['EDITOR', 'VIEWER', 'CONTENT_MANAGER', 'MEDIA_MANAGER'],
  CONTENT_MANAGER: ['CONTENT_MANAGER', 'VIEWER'],
  MEDIA_MANAGER: ['MEDIA_MANAGER', 'VIEWER'],
  RSVP_MANAGER: ['RSVP_MANAGER', 'VIEWER'],
  COORDINATOR: ['COORDINATOR', 'VIEWER'],
  VIEWER: ['VIEWER'],
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies?.jwt_token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token && typeof req.query?.token === 'string') {
      token = req.query.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. Authentication token missing.',
      });
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      id: string;
      email: string;
      role: AdminRole;
    };

    // If database is connected and ID is valid ObjectId, retrieve and validate the actual database user and status
    if (mongoose.connection.readyState === 1 && decoded.id && mongoose.isValidObjectId(decoded.id)) {
      const admin = await Admin.findById(decoded.id).select('_id email role isActive').lean();
      if (!admin) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized. Admin account not found or has been removed.',
        });
        return;
      }

      if (!admin.isActive) {
        res.status(403).json({
          success: false,
          message: 'Forbidden. Admin account is deactivated. Contact Super Admin.',
        });
        return;
      }

      req.admin = {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      };
    } else {
      req.admin = decoded;
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Invalid or expired token.',
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks if the authenticated admin has one of the permitted roles using the role hierarchy.
 * SUPER_ADMIN is always granted access.
 */
export const requireRole = (...allowedRoles: AdminRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. Please login to access this resource.',
      });
      return;
    }

    const userRole = req.admin.role;

    if (userRole === 'SUPER_ADMIN') {
      next();
      return;
    }

    const userPermittedRoles = ROLE_HIERARCHY[userRole] || [userRole];
    const hasPermission = allowedRoles.some((role) => userPermittedRoles.includes(role));

    if (hasPermission) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: `Forbidden. Your role (${userRole}) does not have permission for this action. Required: ${allowedRoles.join(', ')}`,
    });
  };
};
