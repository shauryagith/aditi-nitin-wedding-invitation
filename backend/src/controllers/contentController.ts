import { Request, Response, NextFunction } from 'express';
import { Wedding } from '../models/Wedding.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AuthRequest } from '../middleware/auth.js';
import { appearanceSchema, seoSchema } from '../validators/schemas.js';
import { socketEmitter } from '../socket/index.js';
import { CMS_EVENTS } from '../socket/events.js';

export const contentController = {
  getWeddingContent: async (req: Request, res: Response): Promise<void> => {
    try {
      let wedding = await Wedding.findOne();
      if (!wedding) {
        wedding = await Wedding.create({});
      }
      res.json({ success: true, data: wedding });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  updateGeneralContent: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      let wedding = await Wedding.findOne();
      if (!wedding) wedding = new Wedding();

      const {
        brideName,
        brideNameHi,
        brideBio,
        brideImage,
        brideMother,
        brideFather,
        groomName,
        groomNameHi,
        groomBio,
        groomImage,
        groomMother,
        groomFather,
        weddingDate,
        timezone,
        venue,
        address,
        coordinates,
        directions,
        mapUrl,
        invitationMessage,
        invitationMessageHi,
        websiteSettings,
      } = req.body;

      if (brideName !== undefined) wedding.brideName = brideName;
      if (brideNameHi !== undefined) wedding.brideNameHi = brideNameHi;
      if (brideBio !== undefined) wedding.brideBio = brideBio;
      if (brideImage !== undefined) wedding.brideImage = brideImage;
      if (brideMother !== undefined) wedding.brideMother = brideMother;
      if (brideFather !== undefined) wedding.brideFather = brideFather;

      if (groomName !== undefined) wedding.groomName = groomName;
      if (groomNameHi !== undefined) wedding.groomNameHi = groomNameHi;
      if (groomBio !== undefined) wedding.groomBio = groomBio;
      if (groomImage !== undefined) wedding.groomImage = groomImage;
      if (groomMother !== undefined) wedding.groomMother = groomMother;
      if (groomFather !== undefined) wedding.groomFather = groomFather;

      if (weddingDate !== undefined) wedding.weddingDate = weddingDate;
      if (timezone !== undefined) wedding.timezone = timezone;
      if (venue !== undefined) wedding.venue = venue;
      if (address !== undefined) wedding.address = address;
      if (coordinates !== undefined) wedding.coordinates = coordinates;
      if (directions !== undefined) wedding.directions = directions;
      if (mapUrl !== undefined) wedding.mapUrl = mapUrl;

      if (invitationMessage !== undefined) wedding.invitationMessage = invitationMessage;
      if (invitationMessageHi !== undefined) wedding.invitationMessageHi = invitationMessageHi;

      if (websiteSettings) {
        wedding.websiteSettings = {
          ...wedding.websiteSettings,
          ...websiteSettings,
        };
      }

      await wedding.save();

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'UPDATE',
        entity: 'CONTENT',
        details: 'Updated core wedding content and couple details',
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.CONTENT_UPDATED, {
        entity: 'wedding',
        action: 'update',
        data: wedding,
      });

      res.json({ success: true, message: 'Wedding content updated successfully', data: wedding });
    } catch (err) {
      next(err);
    }
  },

  updateHeroSlides: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slides } = req.body;
      if (!Array.isArray(slides)) {
        res.status(400).json({ success: false, message: 'Slides must be an array.' });
        return;
      }

      let wedding = await Wedding.findOne();
      if (!wedding) wedding = new Wedding();

      wedding.heroSlides = slides;
      await wedding.save();

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'UPDATE',
        entity: 'CONTENT',
        details: `Updated Hero Slider (${slides.length} slides)`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.HERO_UPDATED, {
        entity: 'hero',
        action: 'update',
        data: wedding.heroSlides,
      });

      res.json({ success: true, message: 'Hero slides updated', data: wedding.heroSlides });
    } catch (err) {
      next(err);
    }
  },

  updateStoryMilestones: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { milestones } = req.body;
      if (!Array.isArray(milestones)) {
        res.status(400).json({ success: false, message: 'Milestones must be an array.' });
        return;
      }

      let wedding = await Wedding.findOne();
      if (!wedding) wedding = new Wedding();

      wedding.storyMilestones = milestones;
      await wedding.save();

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.STORY_UPDATED, {
        entity: 'story',
        action: 'update',
        data: wedding.storyMilestones,
      });

      res.json({ success: true, message: 'Story milestones updated', data: wedding.storyMilestones });
    } catch (err) {
      next(err);
    }
  },

  updateFamilyMembers: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { members } = req.body;
      if (!Array.isArray(members)) {
        res.status(400).json({ success: false, message: 'Family members must be an array.' });
        return;
      }

      let wedding = await Wedding.findOne();
      if (!wedding) wedding = new Wedding();

      wedding.familyMembers = members;
      await wedding.save();

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.FAMILY_UPDATED, {
        entity: 'family',
        action: 'update',
        data: wedding.familyMembers,
      });

      res.json({ success: true, message: 'Family members updated', data: wedding.familyMembers });
    } catch (err) {
      next(err);
    }
  },

  updateAppearance: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = appearanceSchema.parse(req.body);
      let wedding = await Wedding.findOne();
      if (!wedding) wedding = new Wedding();

      wedding.appearance = parsed;
      await wedding.save();

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'SETTINGS_CHANGE',
        entity: 'APPEARANCE',
        details: `Updated website theme colors: ${parsed.primaryColor} / ${parsed.secondaryColor}`,
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.APPEARANCE_UPDATED, {
        entity: 'appearance',
        action: 'update',
        data: wedding.appearance,
      });

      res.json({ success: true, message: 'Appearance settings updated', data: wedding.appearance });
    } catch (err) {
      next(err);
    }
  },

  updateSeo: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = seoSchema.parse(req.body);
      let wedding = await Wedding.findOne();
      if (!wedding) wedding = new Wedding();

      wedding.seo = parsed;
      await wedding.save();

      await ActivityLog.create({
        adminId: req.admin?.id,
        adminEmail: req.admin?.email || 'admin@aditinitinwedding.com',
        action: 'SETTINGS_CHANGE',
        entity: 'SEO',
        details: 'Updated SEO metadata and OpenGraph tags',
      }).catch(() => null);

      // Real-Time Broadcast
      socketEmitter.emitToPublic(CMS_EVENTS.SETTINGS_UPDATED, {
        entity: 'settings',
        action: 'update',
        data: wedding.seo,
      });

      res.json({ success: true, message: 'SEO settings updated', data: wedding.seo });
    } catch (err) {
      next(err);
    }
  },
};
