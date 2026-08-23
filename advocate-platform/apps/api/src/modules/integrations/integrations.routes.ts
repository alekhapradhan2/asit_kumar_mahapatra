import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/response';
import { prisma } from '../../config/database';
import { syncCase, getAvailableProviders } from '../../integrations/court/ProviderRegistry';

const router = Router();

// All integration routes are admin-only
router.use(authenticate, requireRole('SUPER_ADMIN', 'ADMIN'));

// GET /api/v1/integrations/providers
router.get('/providers', asyncHandler(async (_req, res) => {
  const providers = getAvailableProviders().map((p) => ({
    name: p.name,
    description: p.description,
    available: p.isAvailable(),
  }));
  sendSuccess(res, providers, 'Available court data providers');
}));

// POST /api/v1/integrations/sync/:caseId
router.post('/sync/:caseId', asyncHandler(async (req, res) => {
  const { caseId } = req.params;
  const { provider } = req.body;

  await syncCase(caseId, provider);
  sendSuccess(res, null, 'Sync initiated');
}));

// GET /api/v1/integrations/sync-logs
router.get('/sync-logs', asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const [logs, total] = await Promise.all([
    prisma.syncLog.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { syncedAt: 'desc' },
    }),
    prisma.syncLog.count(),
  ]);

  res.json({ success: true, message: 'Sync logs retrieved', data: logs,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}));

// GET /api/v1/integrations/sync-logs/:caseId
router.get('/sync-logs/:caseId', asyncHandler(async (req, res) => {
  const logs = await prisma.syncLog.findMany({
    where: { caseId: req.params.caseId },
    orderBy: { syncedAt: 'desc' },
    take: 50,
  });
  sendSuccess(res, logs, 'Case sync logs retrieved');
}));

export { router as integrationsRouter };
