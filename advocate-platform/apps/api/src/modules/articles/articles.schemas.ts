import { z } from 'zod';
import slugify from 'slugify';

export const createArticleSchema = z.object({
  title: z.string().min(3).max(300),
  slug: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (val) return slugify(val, { lower: true, strict: true });
      return undefined;
    }),
  shortDesc: z.string().max(500).optional(),
  content: z.string().min(10),
  featuredImage: z.string().url().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  practiceAreas: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  scheduledAt: z.string().datetime().optional().nullable(),
  seoTitle: z.string().max(70).optional(),
  metaDesc: z.string().max(160).optional(),
  focusKeywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().url().optional().nullable(),
  ogImage: z.string().url().optional().nullable(),
});

export const updateArticleSchema = createArticleSchema.partial();

export const articleQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'publishedAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type ArticleQuery = z.infer<typeof articleQuerySchema>;
