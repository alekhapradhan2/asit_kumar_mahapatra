import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate';
import { audit } from '../../middleware/audit.middleware';
import {
  createClientSchema,
  updateClientSchema,
  clientQuerySchema,
} from './clients.schemas';
import * as ClientController from './clients.controller';

const router = Router();

// All client routes require authentication + admin role
router.use(authenticate, requireRole('SUPER_ADMIN', 'ADMIN'));

router.get(
  '/',
  validate(clientQuerySchema, 'query'),
  ClientController.listClients
);

router.post(
  '/',
  validate(createClientSchema),
  audit({ action: 'CLIENT_CREATED', resourceType: 'Client', resourceId: (_req) => undefined }),
  ClientController.createClient
);

router.get('/:id', ClientController.getClient);

router.put(
  '/:id',
  validate(updateClientSchema),
  audit({ action: 'CLIENT_UPDATED', resourceType: 'Client' }),
  ClientController.updateClient
);

router.delete(
  '/:id',
  audit({ action: 'CLIENT_DISABLED', resourceType: 'Client' }),
  ClientController.disableClient
);

router.get('/:id/cases', ClientController.getClientCases);

export { router as clientsRouter };
