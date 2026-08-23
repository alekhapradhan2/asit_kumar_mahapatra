import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate';
import { audit } from '../../middleware/audit.middleware';
import { messageQuerySchema, createMessageSchema } from './messages.schemas';
import * as MessageController from './messages.controller';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  validate(messageQuerySchema, 'query'),
  MessageController.listMessages
);

router.post(
  '/',
  validate(createMessageSchema),
  audit({ action: 'MESSAGE_SENT', resourceType: 'Message' }),
  MessageController.sendMessage
);

router.patch('/:clientId/read', MessageController.markAsRead);

export { router as messagesRouter };
