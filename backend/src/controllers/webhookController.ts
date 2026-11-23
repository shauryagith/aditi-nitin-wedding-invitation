import { Request, Response } from 'express';
import { ENV } from '../config/env.js';
import { whatsappService } from '../services/whatsappService.js';

export const webhookController = {
  /**
   * Webhook verification for Meta WhatsApp Cloud API
   */
  verifyWebhook: (req: Request, res: Response): void => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === ENV.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      console.log('[WhatsApp Webhook] Verification successful');
      res.status(200).send(challenge);
      return;
    }

    console.warn('[WhatsApp Webhook] Verification failed. Token mismatch.');
    res.status(403).json({ success: false, message: 'Verification failed' });
  },

  /**
   * Webhook receiver for incoming delivery status updates and replies
   */
  handleWebhook: async (req: Request, res: Response): Promise<void> => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      try {
        const entries = body.entry || [];
        for (const entry of entries) {
          const changes = entry.changes || [];
          for (const change of changes) {
            const value = change.value;
            if (value && value.statuses) {
              for (const status of value.statuses) {
                await whatsappService.handleWebhookStatusUpdate(status);
              }
            }
          }
        }
      } catch (err: any) {
        console.error('[WhatsApp Webhook Process Error]:', err.message);
      }
      res.status(200).send('EVENT_RECEIVED');
      return;
    }

    res.status(404).send();
  },
};
