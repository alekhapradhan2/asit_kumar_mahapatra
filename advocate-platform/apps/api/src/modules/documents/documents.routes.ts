import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate';
import { audit } from '../../middleware/audit.middleware';
import {
  documentQuerySchema,
  updateVisibilitySchema,
} from './documents.schemas';
import * as DocumentController from './documents.controller';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

// All document routes require authentication
router.use(authenticate);

router.get(
  '/',
  validate(documentQuerySchema, 'query'),
  DocumentController.listDocuments
);

router.post(
  '/upload',
  upload.single('file'),
  audit({ action: 'DOCUMENT_UPLOADED', resourceType: 'Document' }),
  DocumentController.uploadDocument
);

router.get('/:id', DocumentController.getDocument);

router.get('/:id/download', DocumentController.downloadDocument);

router.patch(
  '/:id/visibility',
  requireRole('SUPER_ADMIN', 'ADMIN'),
  validate(updateVisibilitySchema),
  audit({ action: 'DOCUMENT_VISIBILITY_UPDATED', resourceType: 'Document' }),
  DocumentController.updateVisibility
);

router.delete(
  '/:id',
  audit({ action: 'DOCUMENT_DELETED', resourceType: 'Document' }),
  DocumentController.deleteDocument
);

export { router as documentsRouter };
