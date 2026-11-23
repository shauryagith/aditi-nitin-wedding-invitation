import { Router } from 'express';
import { webhookController } from '../controllers/webhookController.js';

const router = Router();

router.get('/whatsapp', webhookController.verifyWebhook);
router.post('/whatsapp', webhookController.handleWebhook);

export default router;
