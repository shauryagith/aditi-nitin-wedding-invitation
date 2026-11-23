import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AuthRequest } from '../middleware/auth.js';
import { adminUserSchema } from '../validators/schemas.js';

export const adminUserController = {
  getUsers: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await Admin.find().select('-passwordHash').sort({ createdAt: -1 });
      res.json({ success: true, data: users });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  createUser: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role, isActive } = adminUserSchema.parse(req.body);
      const normalizedEmail = email.toLowerCase().trim();

      const existing = await Admin.findOne({ email: normalizedEmail });
      if (existing) {
        res.status(409).json({ success: false, message: 'An admin user with this email already exists.' });
        return;
      }

      const defaultPassword = password || 'WeddingAdmin@2026';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      const newUser = await Admin.create({
        name,
        email: normalizedEmail,
        passwordHash,
        role,
        isActive: isActive !== undefined ? isActive : true,
      });

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'CREATE',
        entity: 'ADMIN_USER',
        entityId: newUser._id.toString(),
        details: `Created new admin user: ${newUser.name} with role ${newUser.role}`,
      }).catch(() => null);

      res.status(201).json({
        success: true,
        message: 'Admin user created successfully',
        data: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isActive: newUser.isActive,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, role, isActive, password } = req.body;

      const user = await Admin.findById(id);
      if (!user) {
        res.status(404).json({ success: false, message: 'Admin user not found' });
        return;
      }

      if (name) user.name = name;
      if (role) user.role = role;
      if (isActive !== undefined) user.isActive = isActive;
      if (password && password.length >= 8) {
        user.passwordHash = await bcrypt.hash(password, 10);
      }

      await user.save();

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'UPDATE',
        entity: 'ADMIN_USER',
        entityId: user._id.toString(),
        details: `Updated admin user: ${user.name} (${user.role})`,
      }).catch(() => null);

      res.json({
        success: true,
        message: 'Admin user updated',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (req.admin?.id === id) {
        res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
        return;
      }

      const user = await Admin.findByIdAndDelete(id);
      if (!user) {
        res.status(404).json({ success: false, message: 'Admin user not found' });
        return;
      }

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'DELETE',
        entity: 'ADMIN_USER',
        entityId: id,
        details: `Deleted admin account: ${user.email}`,
      }).catch(() => null);

      res.json({ success: true, message: 'Admin user deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
