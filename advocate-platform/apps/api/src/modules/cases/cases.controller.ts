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
