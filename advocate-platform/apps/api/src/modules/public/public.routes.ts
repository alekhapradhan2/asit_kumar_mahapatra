import { Router } from 'express';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/response';

const router = Router();

// GET /api/v1/public/site-config
// Returns non-sensitive public configuration for the frontend
router.get(
  '/site-config',
  asyncHandler(async (_req, res) => {
    const settings = await prisma.siteSettings.findMany();
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    const config = {
      siteName: settingsMap['SITE_NAME'] || env.SITE_NAME,
      tagline: settingsMap['SITE_TAGLINE'] || env.SITE_TAGLINE,
      contactEmail: settingsMap['CONTACT_EMAIL'] || env.CONTACT_EMAIL,
      contactPhone: settingsMap['CONTACT_PHONE'] || env.CONTACT_PHONE,
      officeAddress: settingsMap['OFFICE_ADDRESS'] || env.OFFICE_ADDRESS,
      workingHours: settingsMap['WORKING_HOURS'] || 'Mon–Sat: 10:00 AM – 6:00 PM',
      primaryColor: settingsMap['PRIMARY_COLOR'] || env.PRIMARY_COLOR,
      defaultSeoTitle: settingsMap['DEFAULT_SEO_TITLE'] || env.DEFAULT_SEO_TITLE,
      defaultMetaDesc: settingsMap['DEFAULT_META_DESC'] || env.DEFAULT_META_DESC,
      socialLinks: {
        facebook: settingsMap['SOCIAL_FACEBOOK'] || null,
        twitter: settingsMap['SOCIAL_TWITTER'] || null,
        linkedin: settingsMap['SOCIAL_LINKEDIN'] || null,
        instagram: settingsMap['SOCIAL_INSTAGRAM'] || null,
        youtube: settingsMap['SOCIAL_YOUTUBE'] || null,
      },
      // Google verification — only if set
      googleSiteVerification: settingsMap['GOOGLE_SITE_VERIFICATION'] || null,
    };

    sendSuccess(res, config, 'Site config retrieved');
  })
);

// GET /api/v1/public/articles
router.get(
  '/articles',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const category = req.query.category as string | undefined;

    const where = {
      status: 'PUBLISHED' as const,
      ...(category ? { category: { slug: category } } : {}),
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true, title: true, slug: true, shortDesc: true,
          featuredImage: true, publishedAt: true, practiceAreas: true, tags: true,
          category: { select: { name: true, slug: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Articles retrieved',
      data: articles,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  })
);

// GET /api/v1/public/articles/:slug
router.get(
  '/articles/:slug',
  asyncHandler(async (req, res) => {
    const article = await prisma.article.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      include: { category: true, author: { select: { id: true } } },
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    sendSuccess(res, article, 'Article retrieved');
  })
);

// GET /api/v1/public/success-stories
router.get(
  '/success-stories',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const [stories, total] = await Promise.all([
      prisma.successStory.findMany({
        where: { status: 'PUBLISHED' },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true, title: true, slug: true, shortSummary: true,
          featuredImage: true, practiceArea: true, result: true,
          isAnonymous: true, clientDisplay: true, publishedAt: true,
        },
      }),
      prisma.successStory.count({ where: { status: 'PUBLISHED' } }),
    ]);

    res.json({
      success: true,
      message: 'Success stories retrieved',
      data: stories,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  })
);

// GET /api/v1/public/success-stories/:slug
router.get(
  '/success-stories/:slug',
  asyncHandler(async (req, res) => {
    const story = await prisma.successStory.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
    });

    if (!story) {
      return res.status(404).json({ success: false, message: 'Success story not found' });
    }

    // Never expose internal notes or full case data publicly
    const { ...safeStory } = story;
    sendSuccess(res, safeStory, 'Success story retrieved');
  })
);

export { router as publicRouter };
