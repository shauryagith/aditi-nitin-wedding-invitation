import { Request, Response } from 'express';
import { ActivityLog } from '../models/ActivityLog.js';

export const activityLogController = {
  getLogs: async (req: Request, res: Response): Promise<void> => {
    try {
      const { action, entity, limit = 100 } = req.query;
      const query: any = {};

      if (action) query.action = action;
      if (entity) query.entity = entity;

      const logs = await ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .limit(Math.min(200, parseInt(String(limit), 10) || 100));

      res.json({ success: true, data: logs });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
