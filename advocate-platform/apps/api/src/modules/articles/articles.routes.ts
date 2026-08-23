import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { createArticleSchema, updateArticleSchema, articleQuerySchema } from './articles.schemas';
import * as ArticlesService from './articles.service';

const router = Router();

// Public: list published articles
router.get(
  '/',
  validate(articleQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';
    const { articles, total } = await ArticlesService.listArticles(req.query as any, isAdmin);
    sendPaginated(res, articles, total, Number(req.query.page || 1), Number(req.query.limit || 20));
  })
);

// Public: get article by slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';
    const article = await ArticlesService.getArticleBySlug(req.params.slug, isAdmin);
    sendSuccess(res, article, 'Article retrieved');
  })
);

// Admin: create article
router.post(
  '/',
  authenticate,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  validate(createArticleSchema),
  asyncHandler(async (req, res) => {
    const article = await ArticlesService.createArticle(req.body, req.user!.sub);
    sendSuccess(res, article, 'Article created', 201);
  })
);

// Admin: update article
router.put(
  '/:id',
  authenticate,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  validate(updateArticleSchema),
  asyncHandler(async (req, res) => {
    const article = await ArticlesService.updateArticle(req.params.id, req.body, req.user!.sub);
    sendSuccess(res, article, 'Article updated');
  })
);

// Admin: publish / unpublish
router.post('/:id/publish', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(async (req, res) => {
  const article = await ArticlesService.publishArticle(req.params.id);
  sendSuccess(res, article, 'Article published');
}));

router.post('/:id/unpublish', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(async (req, res) => {
  const article = await ArticlesService.unpublishArticle(req.params.id);
  sendSuccess(res, article, 'Article unpublished');
}));

router.delete('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(async (req, res) => {
  await ArticlesService.deleteArticle(req.params.id);
  sendSuccess(res, null, 'Article archived');
}));

export { router as articlesRouter };
