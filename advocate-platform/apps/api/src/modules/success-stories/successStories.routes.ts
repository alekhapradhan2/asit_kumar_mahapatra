import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/response';
import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';

const router = Router();

// GET /api/v1/success-stories (public)
router.get('/', asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';

  const [stories, total] = await Promise.all([
    prisma.successStory.findMany({
      where: isAdmin ? {} : { status: 'PUBLISHED' },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, shortSummary: true,
        featuredImage: true, practiceArea: true, result: true,
        isAnonymous: true, clientDisplay: true, publishedAt: true, status: true,
      },
    }),
    prisma.successStory.count({ where: isAdmin ? {} : { status: 'PUBLISHED' } }),
  ]);

  res.json({ success: true, message: 'Stories retrieved', data: stories,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}));

// GET /api/v1/success-stories/:slug (public)
router.get('/:slug', asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';
  const story = await prisma.successStory.findFirst({
    where: { slug: req.params.slug, ...(isAdmin ? {} : { status: 'PUBLISHED' }) },
  });
  if (!story) throw new AppError('Story not found', 404);
  sendSuccess(res, story, 'Story retrieved');
}));

// POST /api/v1/success-stories (admin only)
router.post('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(async (req, res) => {
  const { title, slug, shortSummary, fullStory, category, practiceArea, result,
    isAnonymous, clientDisplay, featuredImage, seoTitle, metaDesc, canonicalUrl, ogImage } = req.body;

  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existing = await prisma.successStory.findUnique({ where: { slug: finalSlug } });
  if (existing) throw new AppError('Slug already exists', 409);

  const story = await prisma.successStory.create({
    data: {
      title, slug: finalSlug, shortSummary, fullStory, category, practiceArea, result,
      isAnonymous: isAnonymous ?? true, clientDisplay, featuredImage,
      authorId: req.user!.sub,
      seoTitle, metaDesc, canonicalUrl, ogImage,
      status: 'DRAFT',
    },
  });
  sendSuccess(res, story, 'Story created', 201);
}));

// PUT /api/v1/success-stories/:id (admin)
router.put('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(async (req, res) => {
  const story = await prisma.successStory.update({
    where: { id: req.params.id },
    data: req.body,
  });
  sendSuccess(res, story, 'Story updated');
}));

// POST /api/v1/success-stories/:id/publish (admin)
router.post('/:id/publish', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(async (req, res) => {
  const story = await prisma.successStory.update({
    where: { id: req.params.id },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  });
  sendSuccess(res, story, 'Story published');
}));

export { router as successStoriesRouter };
