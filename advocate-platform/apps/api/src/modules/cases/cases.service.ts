import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import { nanoid } from 'nanoid';
import type {
  CreateCaseInput,
  UpdateCaseInput,
  UpdateStatusInput,
  HearingInput,
  VerdictInput,
  CaseQuery,
} from './cases.schemas';
import type { Role } from '@advocate/shared-types';

// ─── Generate CASE-XXXXXX ID ──────────────────────────────────────────────────

async function generateCaseId(): Promise<string> {
  let attempts = 0;
  while (attempts < 10) {
    const id = `CASE-${nanoid(8).toUpperCase()}`;
    const existing = await prisma.case.findUnique({ where: { internalCaseId: id } });
    if (!existing) return id;
    attempts++;
  }
  throw new AppError('Failed to generate unique Case ID', 500);
}

// ─── Create Case ──────────────────────────────────────────────────────────────

export async function createCase(data: CreateCaseInput, createdBy?: string) {
  // Verify client exists
  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
    select: { id: true, isActive: true },
  });
  if (!client) throw new AppError('Client not found', 404);

  const internalCaseId = await generateCaseId();

  const newCase = await prisma.case.create({
    data: {
      internalCaseId,
      clientId: data.clientId,
      title: data.title,
      caseType: data.caseType,
      practiceArea: data.practiceArea,
      courtName: data.courtName,
      courtLocation: data.courtLocation,
      caseNumber: data.caseNumber,
      cnrNumber: data.cnrNumber,
      filingNumber: data.filingNumber,
      filingDate: data.filingDate ? new Date(data.filingDate) : null,
      registrationDate: data.registrationDate ? new Date(data.registrationDate) : null,
      currentStatus: data.currentStatus,
      caseStage: data.caseStage,
      oppositeParty: data.oppositeParty,
      oppositeAdvocate: data.oppositeAdvocate,
      judgeDetails: data.judgeDetails,
      nextHearingDate: data.nextHearingDate ? new Date(data.nextHearingDate) : null,
      priority: data.priority,
      assignedAdvocate: data.assignedAdvocate,
      internalNotes: data.internalNotes,
    },
  });

  // Add initial timeline entry
  await prisma.caseStatusHistory.create({
    data: {
      caseId: newCase.id,
      status: data.currentStatus,
      title: 'Case Created',
      description: `Case registered: ${data.title}`,
      date: new Date(),
      source: 'ADMIN_UPDATE',
      isClientVisible: true,
      createdBy,
    },
  });

  return getCaseById(newCase.id);
}

// ─── List Cases ───────────────────────────────────────────────────────────────

export async function listCases(query: CaseQuery, requestingUser?: { role: Role; clientId?: string }) {
  const { page, limit, search, status, clientId, practiceArea, priority, isArchived, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.CaseWhereInput = {};

  // Clients can only see their own cases
  if (requestingUser?.role === 'CLIENT') {
    where.clientId = requestingUser.clientId;
    where.isArchived = false; // Clients don't see archived cases by default
  } else {
    if (clientId) where.clientId = clientId;
    if (isArchived !== undefined) where.isArchived = isArchived === 'true';
  }

  if (status) where.currentStatus = status;
  if (practiceArea) where.practiceArea = practiceArea;
  if (priority) where.priority = priority;

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { caseNumber: { contains: search, mode: 'insensitive' } },
      { cnrNumber: { contains: search, mode: 'insensitive' } },
      { internalCaseId: { contains: search.toUpperCase() } },
      { client: { fullName: { contains: search, mode: 'insensitive' } } },
      { client: { clientId: { contains: search.toUpperCase() } } },
    ];
  }

  const [cases, total] = await Promise.all([
    prisma.case.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        client: {
          select: { clientId: true, fullName: true },
        },
      },
    }),
    prisma.case.count({ where }),
  ]);

  return { cases, total };
}

// ─── Get Case by ID ───────────────────────────────────────────────────────────

export async function getCaseById(id: string, requestingUser?: { role: Role; clientId?: string }) {
  const caseData = await prisma.case.findUnique({
    where: { id },
    include: {
      client: {
        select: { id: true, clientId: true, fullName: true, email: true, mobile: true },
      },
      statusHistory: {
        orderBy: { date: 'asc' },
      },
      hearings: {
        orderBy: { hearingDate: 'desc' },
      },
      parties: true,
      verdict: true,
    },
  });

  if (!caseData) throw new AppError('Case not found', 404);

  // Object-level authorization: client can only see their own case
  if (requestingUser?.role === 'CLIENT') {
    if (caseData.clientId !== requestingUser.clientId) {
      throw new AppError('Access denied', 403);
    }

    // Filter non-client-visible items
    caseData.statusHistory = caseData.statusHistory.filter((h) => h.isClientVisible);
    caseData.hearings = caseData.hearings.filter((h) => h.isClientVisible);

    // Remove internal notes from client view
    (caseData as any).internalNotes = undefined;
  }

  return caseData;
}

// ─── Update Case ──────────────────────────────────────────────────────────────

export async function updateCase(id: string, data: UpdateCaseInput) {
  const existing = await prisma.case.findUnique({ where: { id } });
  if (!existing) throw new AppError('Case not found', 404);

  return prisma.case.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.caseType && { caseType: data.caseType }),
      ...(data.practiceArea && { practiceArea: data.practiceArea }),
      ...(data.courtName !== undefined && { courtName: data.courtName }),
      ...(data.courtLocation !== undefined && { courtLocation: data.courtLocation }),
      ...(data.caseNumber !== undefined && { caseNumber: data.caseNumber }),
      ...(data.cnrNumber !== undefined && { cnrNumber: data.cnrNumber }),
      ...(data.filingNumber !== undefined && { filingNumber: data.filingNumber }),
      ...(data.filingDate !== undefined && {
        filingDate: data.filingDate ? new Date(data.filingDate) : null,
      }),
      ...(data.registrationDate !== undefined && {
        registrationDate: data.registrationDate ? new Date(data.registrationDate) : null,
      }),
      ...(data.caseStage !== undefined && { caseStage: data.caseStage }),
      ...(data.oppositeParty !== undefined && { oppositeParty: data.oppositeParty }),
      ...(data.oppositeAdvocate !== undefined && { oppositeAdvocate: data.oppositeAdvocate }),
      ...(data.judgeDetails !== undefined && { judgeDetails: data.judgeDetails }),
      ...(data.nextHearingDate !== undefined && {
        nextHearingDate: data.nextHearingDate ? new Date(data.nextHearingDate) : null,
      }),
      ...(data.priority && { priority: data.priority }),
      ...(data.assignedAdvocate !== undefined && { assignedAdvocate: data.assignedAdvocate }),
      ...(data.internalNotes !== undefined && { internalNotes: data.internalNotes }),
    },
  });
}

// ─── Update Status + Add Timeline Entry ───────────────────────────────────────

export async function updateCaseStatus(
  id: string,
  data: UpdateStatusInput,
  createdBy?: string
) {
  const existing = await prisma.case.findUnique({ where: { id } });
  if (!existing) throw new AppError('Case not found', 404);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.case.update({
      where: { id },
      data: {
        currentStatus: data.status,
        updatedAt: new Date(),
      },
    });

    await tx.caseStatusHistory.create({
      data: {
        caseId: id,
        status: data.status,
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
        source: data.source,
        isClientVisible: data.isClientVisible,
        relatedDocId: data.relatedDocId,
        createdBy,
      },
    });

    return updated;
  });
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export async function getTimeline(caseId: string, isClient: boolean) {
  const caseData = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseData) throw new AppError('Case not found', 404);

  return prisma.caseStatusHistory.findMany({
    where: {
      caseId,
      ...(isClient ? { isClientVisible: true } : {}),
    },
    orderBy: { date: 'asc' },
  });
}

export async function addTimelineEntry(caseId: string, data: any, createdBy?: string) {
  const caseData = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseData) throw new AppError('Case not found', 404);

  return prisma.caseStatusHistory.create({
    data: {
      caseId,
      status: data.status,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      source: data.source,
      isClientVisible: data.isClientVisible,
      relatedDocId: data.relatedDocId,
      createdBy,
    },
  });
}

// ─── Hearings ─────────────────────────────────────────────────────────────────

export async function listHearings(caseId: string, isClient: boolean) {
  return prisma.hearing.findMany({
    where: {
      caseId,
      ...(isClient ? { isClientVisible: true } : {}),
    },
    orderBy: { hearingDate: 'desc' },
  });
}

export async function addHearing(caseId: string, data: HearingInput) {
  const caseData = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseData) throw new AppError('Case not found', 404);

  const hearing = await prisma.hearing.create({
    data: {
      caseId,
      hearingDate: new Date(data.hearingDate),
      purpose: data.purpose,
      result: data.result,
      nextDate: data.nextDate ? new Date(data.nextDate) : null,
      notes: data.notes,
      source: data.source,
      isClientVisible: data.isClientVisible,
    },
  });

  // Update case next hearing date if this is in the future
  if (new Date(data.hearingDate) > new Date()) {
    await prisma.case.update({
      where: { id: caseId },
      data: { nextHearingDate: new Date(data.hearingDate) },
    });
  }

  return hearing;
}

// ─── Verdict ──────────────────────────────────────────────────────────────────

export async function getVerdict(caseId: string, isClient: boolean) {
  const verdict = await prisma.verdict.findUnique({ where: { caseId } });
  if (!verdict) return null;

  if (isClient) {
    const { internalNotes, judgmentFileKey, ...clientVerdict } = verdict;
    void internalNotes; void judgmentFileKey;
    return clientVerdict;
  }

  return verdict;
}

export async function upsertVerdict(caseId: string, data: VerdictInput) {
  const caseData = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseData) throw new AppError('Case not found', 404);

  return prisma.verdict.upsert({
    where: { caseId },
    create: {
      caseId,
      outcome: data.outcome,
      verdictDate: data.verdictDate ? new Date(data.verdictDate) : null,
      summary: data.summary,
      clientSummary: data.clientSummary,
      internalNotes: data.internalNotes,
      importantOrders: data.importantOrders,
      judgmentFileKey: data.judgmentFileKey,
    },
    update: {
      outcome: data.outcome,
      verdictDate: data.verdictDate ? new Date(data.verdictDate) : null,
      summary: data.summary,
      clientSummary: data.clientSummary,
      internalNotes: data.internalNotes,
      importantOrders: data.importantOrders,
      judgmentFileKey: data.judgmentFileKey,
    },
  });
}

// ─── Archive Case ─────────────────────────────────────────────────────────────

export async function archiveCase(id: string) {
  const caseData = await prisma.case.findUnique({ where: { id } });
  if (!caseData) throw new AppError('Case not found', 404);

  return prisma.case.update({
    where: { id },
    data: {
      isArchived: true,
      currentStatus: 'ARCHIVED',
    },
  });
}
