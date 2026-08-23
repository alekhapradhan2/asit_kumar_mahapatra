import { z } from 'zod';

export const documentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  search: z.string().optional(),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
  docType: z.enum([
    'CLIENT_DOCUMENT',
    'PETITION',
    'AFFIDAVIT',
    'NOTICE',
    'COURT_ORDER',
    'EVIDENCE',
    'HEARING_DOCUMENT',
    'JUDGMENT',
    'FINAL_VERDICT',
    'SETTLEMENT',
    'OTHER',
  ]).optional(),
  visibility: z.enum(['ADMIN_ONLY', 'INTERNAL_TEAM', 'CLIENT_VISIBLE']).optional(),
  uploadedByRole: z.enum(['CLIENT', 'ADMIN', 'SUPER_ADMIN']).optional(),
  sortBy: z.enum(['uploadedAt', 'title', 'sizeBytes']).default('uploadedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const createDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  docType: z.enum([
    'CLIENT_DOCUMENT',
    'PETITION',
    'AFFIDAVIT',
    'NOTICE',
    'COURT_ORDER',
    'EVIDENCE',
    'HEARING_DOCUMENT',
    'JUDGMENT',
    'FINAL_VERDICT',
    'SETTLEMENT',
    'OTHER',
  ]).default('OTHER'),
  category: z.string().optional(),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
  visibility: z.enum(['ADMIN_ONLY', 'INTERNAL_TEAM', 'CLIENT_VISIBLE']).default('ADMIN_ONLY'),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional().default([]),
});

export const updateVisibilitySchema = z.object({
  visibility: z.enum(['ADMIN_ONLY', 'INTERNAL_TEAM', 'CLIENT_VISIBLE']),
});

export type DocumentQuery = z.infer<typeof documentQuerySchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateVisibilityInput = z.infer<typeof updateVisibilitySchema>;
