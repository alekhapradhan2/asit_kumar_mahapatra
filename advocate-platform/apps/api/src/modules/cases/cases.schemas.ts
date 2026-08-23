import { z } from 'zod';

const caseStatuses = [
  'CONSULTATION', 'DOCUMENTS_PENDING', 'PREPARING_CASE', 'FILED',
  'REGISTERED', 'NOTICE_ISSUED', 'HEARING_SCHEDULED', 'HEARING_COMPLETED',
  'EVIDENCE_STAGE', 'ARGUMENTS', 'AWAITING_JUDGMENT', 'JUDGMENT_DELIVERED',
  'WON', 'SETTLED', 'CLOSED', 'LOST', 'ARCHIVED',
] as const;

const priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;
const updateSources = ['OFFICIAL_COURT_DATA', 'ADVOCATE_UPDATE', 'ADMIN_UPDATE', 'SYSTEM_SYNC'] as const;

export const createCaseSchema = z.object({
  clientId: z.string().cuid('Invalid client ID'),
  title: z.string().min(3).max(300),
  caseType: z.string().min(1).max(100),
  practiceArea: z.string().min(1).max(100),
  courtName: z.string().max(200).optional(),
  courtLocation: z.string().max(200).optional(),
  caseNumber: z.string().max(100).optional(),
  cnrNumber: z.string().max(50).optional(),
  filingNumber: z.string().max(100).optional(),
  filingDate: z.string().datetime().optional().nullable(),
  registrationDate: z.string().datetime().optional().nullable(),
  currentStatus: z.enum(caseStatuses).default('CONSULTATION'),
  caseStage: z.string().max(100).optional(),
  oppositeParty: z.string().max(200).optional(),
  oppositeAdvocate: z.string().max(200).optional(),
  judgeDetails: z.string().max(200).optional(),
  nextHearingDate: z.string().datetime().optional().nullable(),
  priority: z.enum(priorities).default('NORMAL'),
  assignedAdvocate: z.string().max(100).optional(),
  internalNotes: z.string().max(5000).optional(),
});

export const updateCaseSchema = createCaseSchema.partial().omit({ clientId: true });

export const updateStatusSchema = z.object({
  status: z.enum(caseStatuses),
  title: z.string().min(1).max(300),
  description: z.string().max(2000).optional(),
  date: z.string().datetime().optional(),
  source: z.enum(updateSources).default('ADVOCATE_UPDATE'),
  isClientVisible: z.boolean().default(true),
  relatedDocId: z.string().optional(),
});

export const addTimelineEntrySchema = z.object({
  status: z.enum(caseStatuses),
  title: z.string().min(1).max(300),
  description: z.string().max(2000).optional(),
  date: z.string().datetime(),
  source: z.enum(updateSources).default('ADVOCATE_UPDATE'),
  isClientVisible: z.boolean().default(true),
  relatedDocId: z.string().optional(),
});

export const hearingSchema = z.object({
  hearingDate: z.string().datetime(),
  purpose: z.string().max(300).optional(),
  result: z.string().max(500).optional(),
  nextDate: z.string().datetime().optional().nullable(),
  notes: z.string().max(2000).optional(),
  source: z.enum(updateSources).default('ADVOCATE_UPDATE'),
  isClientVisible: z.boolean().default(true),
});

export const verdictSchema = z.object({
  outcome: z.enum(['WON', 'LOST', 'SETTLED', 'CLOSED']),
  verdictDate: z.string().datetime().optional().nullable(),
  summary: z.string().max(5000).optional(),
  clientSummary: z.string().max(2000).optional(),
  internalNotes: z.string().max(5000).optional(),
  importantOrders: z.string().max(3000).optional(),
  judgmentFileKey: z.string().optional(),
});

export const caseQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(caseStatuses).optional(),
  clientId: z.string().optional(),
  practiceArea: z.string().optional(),
  priority: z.enum(priorities).optional(),
  isArchived: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'nextHearingDate', 'title']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type HearingInput = z.infer<typeof hearingSchema>;
export type VerdictInput = z.infer<typeof verdictSchema>;
export type CaseQuery = z.infer<typeof caseQuerySchema>;
