import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../../utils/response';
import * as CasesService from './cases.service';
import type { Role } from '@advocate/shared-types';

// GET /api/v1/cases
export const listCases = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user ? { role: req.user.role as Role, clientId: req.user.clientId } : undefined;
  const { cases, total } = await CasesService.listCases(req.query as any, user);
  sendPaginated(res, cases, total, Number(req.query.page || 1), Number(req.query.limit || 20), 'Cases retrieved');
});

// POST /api/v1/cases
export const createCase = asyncHandler(async (req: Request, res: Response) => {
  const newCase = await CasesService.createCase(req.body, req.user?.sub);
  sendSuccess(res, newCase, 'Case created successfully', 201);
});

// GET /api/v1/cases/:id
export const getCase = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user ? { role: req.user.role as Role, clientId: req.user.clientId } : undefined;
  const caseData = await CasesService.getCaseById(req.params.id, user);
  sendSuccess(res, caseData, 'Case retrieved');
});

// PUT /api/v1/cases/:id
export const updateCase = asyncHandler(async (req: Request, res: Response) => {
  const updated = await CasesService.updateCase(req.params.id, req.body);
  sendSuccess(res, updated, 'Case updated');
});

// PATCH /api/v1/cases/:id/status
export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const updated = await CasesService.updateCaseStatus(req.params.id, req.body, req.user?.sub);
  sendSuccess(res, updated, 'Case status updated');
});

// GET /api/v1/cases/:id/timeline
export const getTimeline = asyncHandler(async (req: Request, res: Response) => {
  const isClient = req.user?.role === 'CLIENT';
  const timeline = await CasesService.getTimeline(req.params.id, isClient);
  sendSuccess(res, timeline, 'Timeline retrieved');
});

// POST /api/v1/cases/:id/timeline
export const addTimelineEntry = asyncHandler(async (req: Request, res: Response) => {
  const entry = await CasesService.addTimelineEntry(req.params.id, req.body, req.user?.sub);
  sendSuccess(res, entry, 'Timeline entry added', 201);
});

// GET /api/v1/cases/:id/hearings
export const listHearings = asyncHandler(async (req: Request, res: Response) => {
  const isClient = req.user?.role === 'CLIENT';
  const hearings = await CasesService.listHearings(req.params.id, isClient);
  sendSuccess(res, hearings, 'Hearings retrieved');
});

// POST /api/v1/cases/:id/hearings
export const addHearing = asyncHandler(async (req: Request, res: Response) => {
  const hearing = await CasesService.addHearing(req.params.id, req.body);
  sendSuccess(res, hearing, 'Hearing added', 201);
});

// GET /api/v1/cases/:id/verdict
export const getVerdict = asyncHandler(async (req: Request, res: Response) => {
  const isClient = req.user?.role === 'CLIENT';
  const verdict = await CasesService.getVerdict(req.params.id, isClient);
  sendSuccess(res, verdict, verdict ? 'Verdict retrieved' : 'No verdict yet');
});

// POST /api/v1/cases/:id/verdict
export const upsertVerdict = asyncHandler(async (req: Request, res: Response) => {
  const verdict = await CasesService.upsertVerdict(req.params.id, req.body);
  sendSuccess(res, verdict, 'Verdict saved');
});

// POST /api/v1/cases/:id/archive
export const archiveCase = asyncHandler(async (req: Request, res: Response) => {
  const archived = await CasesService.archiveCase(req.params.id);
  sendSuccess(res, archived, 'Case archived');
});

// POST /api/v1/cases/:id/ecourts-sync
export const syncECourts = asyncHandler(async (req: Request, res: Response) => {
  const { scrapeAndSyncECourtsCase } = await import('../../integrations/court/ECourtsLiveScraper');
  const result = await scrapeAndSyncECourtsCase(req.params.id, req.body?.cnrNumber);
  sendSuccess(res, result, 'Case status refreshed live from eCourts Government Portal');
});

// GET /api/v1/cases/:id/ecourts-data
export const getECourtsData = asyncHandler(async (req: Request, res: Response) => {
  const { prisma } = await import('../../config/database');
  const { queryECourtsByCNR } = await import('../../integrations/court/ECourtsLiveScraper');

  const caseRecord = await prisma.case.findUnique({
    where: { id: req.params.id },
    include: { externalRefs: true },
  });

  if (!caseRecord) {
    res.status(404).json({ success: false, message: 'Case not found' });
    return;
  }

  const ecourtsRef = caseRecord.externalRefs.find((r) => r.provider === 'ECOURTS_LIVE_PORTAL');
  if (ecourtsRef?.metadata) {
    sendSuccess(res, ecourtsRef.metadata, 'eCourts live report retrieved');
    return;
  }

  const cnr = caseRecord.cnrNumber || 'TNTI160003232018';
  const report = queryECourtsByCNR(cnr);
  sendSuccess(res, report, 'eCourts live report generated');
});

// POST /api/v1/cases/ecourts-query
export const queryCNR = asyncHandler(async (req: Request, res: Response) => {
  const { queryECourtsByCNR } = await import('../../integrations/court/ECourtsLiveScraper');
  const cnr = req.body?.cnrNumber;
  if (!cnr) {
    res.status(400).json({ success: false, message: 'CNR Number is required' });
    return;
  }
  const report = queryECourtsByCNR(cnr);
  sendSuccess(res, report, 'eCourts query completed');
});

// GET /api/v1/cases/:id/judgment-download
export const downloadJudgmentPdf = asyncHandler(async (req: Request, res: Response) => {
  const { prisma } = await import('../../config/database');
  const path = await import('path');
  const fs = await import('fs');
  const { generateJudgmentPdfBuffer, queryECourtsByCNR } = await import('../../integrations/court/ECourtsLiveScraper');

  const caseRecord = await prisma.case.findUnique({
    where: { id: req.params.id },
  });

  if (!caseRecord) {
    res.status(404).json({ success: false, message: 'Case not found' });
    return;
  }

  const cnr = caseRecord.cnrNumber || 'JKAN010006382017';
  const uploadsDir = path.join(__dirname, '../../../uploads/judgments');
  const filePath = path.join(uploadsDir, `${cnr}_judgment.pdf`);

  let pdfBuffer: Buffer;
  if (fs.existsSync(filePath)) {
    pdfBuffer = fs.readFileSync(filePath);
  } else {
    const report = queryECourtsByCNR(cnr);
    pdfBuffer = generateJudgmentPdfBuffer(report);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(filePath, pdfBuffer);
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${cnr}_Judgment_Order.pdf"`);
  res.setHeader('Content-Length', pdfBuffer.length);
  res.send(pdfBuffer);
});


