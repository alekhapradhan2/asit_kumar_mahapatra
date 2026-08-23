import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate';
import { audit } from '../../middleware/audit.middleware';
import {
  createCaseSchema,
  updateCaseSchema,
  updateStatusSchema,
  addTimelineEntrySchema,
  hearingSchema,
  verdictSchema,
  caseQuerySchema,
} from './cases.schemas';
import * as CasesController from './cases.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// List + Get cases (clients see own; admins see all)
router.get('/', validate(caseQuerySchema, 'query'), CasesController.listCases);
router.get('/:id', CasesController.getCase);
router.get('/:id/timeline', CasesController.getTimeline);
router.get('/:id/hearings', CasesController.listHearings);
router.get('/:id/verdict', CasesController.getVerdict);

// Admin-only mutations
router.post(
  '/',
  requireRole('SUPER_ADMIN', 'ADMIN'),
  validate(createCaseSchema),
  audit({ action: 'CASE_CREATED', resourceType: 'Case' }),
  CasesController.createCase
);

router.put(
  '/:id',
  requireRole('SUPER_ADMIN', 'ADMIN'),
  validate(updateCaseSchema),
  audit({ action: 'CASE_UPDATED', resourceType: 'Case' }),
  CasesController.updateCase
);

router.patch(
  '/:id/status',
  requireRole('SUPER_ADMIN', 'ADMIN'),
  validate(updateStatusSchema),
  audit({ action: 'CASE_STATUS_UPDATED', resourceType: 'Case' }),
  CasesController.updateStatus
);

router.post(
  '/:id/timeline',
  requireRole('SUPER_ADMIN', 'ADMIN'),
  validate(addTimelineEntrySchema),
  CasesController.addTimelineEntry
);

router.post(
  '/:id/hearings',
  requireRole('SUPER_ADMIN', 'ADMIN'),
  validate(hearingSchema),
  audit({ action: 'HEARING_ADDED', resourceType: 'Case' }),
  CasesController.addHearing
);

router.post(
  '/:id/verdict',
  requireRole('SUPER_ADMIN', 'ADMIN'),
  validate(verdictSchema),
  audit({ action: 'VERDICT_SET', resourceType: 'Case' }),
  CasesController.upsertVerdict
);

router.post(
  '/:id/archive',
  requireRole('SUPER_ADMIN', 'ADMIN'),
  audit({ action: 'CASE_ARCHIVED', resourceType: 'Case' }),
  CasesController.archiveCase
);

export { router as casesRouter };
