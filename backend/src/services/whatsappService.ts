import axios from 'axios';
import { ENV } from '../config/env.js';
import { WhatsAppMessage } from '../models/WhatsAppMessage.js';

export interface SendTemplateMessageParams {
  guestId?: string;
  phone: string;
  templateName?: string;
  languageCode?: string;
  components?: any[];
}

export const whatsappService = {
  /**
   * Checks if WhatsApp Business Cloud API credentials are configured in environment
   */
  isConfigured: (): boolean => {
    return Boolean(ENV.WHATSAPP_PHONE_NUMBER_ID && ENV.WHATSAPP_ACCESS_TOKEN);
  },

  /**
   * Sends an approved template message via Meta WhatsApp Business Cloud API
   */
  sendTemplateMessage: async ({
    guestId,
    phone,
    templateName = 'wedding_reminder',
    languageCode = 'en',
    components = [],
  }: SendTemplateMessageParams) => {
    // Standardize phone number format: ensure country code (e.g. 919876543210)
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // If Cloud API credentials are not set, record mock/simulated dispatch for testing without failing
    if (!whatsappService.isConfigured()) {
      console.log(`[WhatsApp Service] Cloud API credentials not set. Simulating message dispatch to: ${cleanPhone}`);
      
      const record = await WhatsAppMessage.create({
        guestId,
        phone: cleanPhone,
        templateName,
        messageType: 'REMINDER',
        status: 'SENT',
        sentAt: new Date(),
        error: 'Cloud API credentials not set (simulated environment)',
      }).catch(() => null);

      return {
        success: true,
        simulated: true,
        message: 'WhatsApp Cloud API credentials not configured in .env. Message recorded in simulation mode.',
        recordId: record?._id,
      };
    }

    const url = `https://graph.facebook.com/${ENV.WHATSAPP_API_VERSION}/${ENV.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components,
        },
      };

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${ENV.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      const messageId = response.data?.messages?.[0]?.id;

      await WhatsAppMessage.create({
        guestId,
        phone: cleanPhone,
        templateName,
        messageType: 'REMINDER',
        providerMessageId: messageId,
        status: 'SENT',
        sentAt: new Date(),
      }).catch((err) => console.warn('Could not save WhatsApp log:', err.message));

      return {
        success: true,
        providerMessageId: messageId,
        data: response.data,
      };
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error('[WhatsApp Cloud API Error]:', errorMsg);

      await WhatsAppMessage.create({
        guestId,
        phone: cleanPhone,
        templateName,
        messageType: 'REMINDER',
        status: 'FAILED',
        error: errorMsg,
        sentAt: new Date(),
      }).catch(() => null);

      throw new Error(`WhatsApp API Error: ${errorMsg}`);
    }
  },

  /**
   * Updates message delivery status from incoming Webhooks (e.g., delivered, read, failed)
   */
  handleWebhookStatusUpdate: async (statusData: any) => {
    try {
      const { id: providerMessageId, status, timestamp, recipient_id } = statusData;

      const updatePayload: any = {
        status: status.toUpperCase(),
      };

      if (status === 'delivered') {
        updatePayload.deliveredAt = new Date(parseInt(timestamp, 10) * 1000);
      }

      await WhatsAppMessage.findOneAndUpdate(
        { providerMessageId },
        { $set: updatePayload },
        { new: true }
      );
    } catch (err: any) {
      console.warn('[WhatsApp Webhook Update Warning]:', err.message);
    }
  },
};
