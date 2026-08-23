import { prisma } from '../../config/database';
import { Prisma, Visibility } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import { storage } from '../../config/storage';
import type { Role } from '@advocate/shared-types';
import type { DocumentQuery, CreateDocumentInput, UpdateVisibilityInput } from './documents.schemas';

// ─── List Documents ──────────────────────────────────────────────────────────

export async function listDocuments(
  query: DocumentQuery,
  requestingUser: { userId: string; role: Role; clientId?: string }
) {
  const { page, limit, search, clientId, caseId, docType, visibility, uploadedByRole, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.DocumentWhereInput = {};

  // Client role authorization: can only see their own client's docs with CLIENT_VISIBLE or uploaded by them
  if (requestingUser.role === 'CLIENT') {
    if (!requestingUser.clientId) {
      throw new AppError('Client record not found for user', 403);
    }
    where.clientId = requestingUser.clientId;
    where.OR = [
      { visibility: 'CLIENT_VISIBLE' },
      { uploadedById: requestingUser.userId },
    ];
  } else {
    // Admin / Super Admin can filter by client
    if (clientId) where.clientId = clientId;
    if (visibility) where.visibility = visibility as Visibility;
  }

  if (caseId) where.caseId = caseId;
  if (docType) where.docType = docType;

  if (uploadedByRole) {
    where.uploadedBy = { role: uploadedByRole };
  }

  if (search) {
    where.AND = [
      {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ],
      },
    ];
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        client: { select: { id: true, clientId: true, fullName: true } },
        case: { select: { id: true, internalCaseId: true, title: true } },
        uploadedBy: {
          select: {
            id: true,
            email: true,
            role: true,
            client: { select: { fullName: true } },
          },
        },
      },
    }),
    prisma.document.count({ where }),
  ]);

  return { documents, total };
}

// ─── Create / Register Document ───────────────────────────────────────────────

export interface SaveDocumentData extends CreateDocumentInput {
  fileKey: string;
  mimeType: string;
  sizeBytes: number;
}

export async function createDocument(
  data: SaveDocumentData,
  uploadedBy: { userId: string; role: Role; clientId?: string }
) {
  let targetClientId = data.clientId;

  // If uploaded by client, ensure client owns the document and visibility is CLIENT_VISIBLE
  if (uploadedBy.role === 'CLIENT') {
    targetClientId = uploadedBy.clientId;
    data.visibility = 'CLIENT_VISIBLE';
    data.docType = 'CLIENT_DOCUMENT';
  }

  // If clientId is provided, verify client exists
  if (targetClientId) {
    const client = await prisma.client.findUnique({ where: { id: targetClientId } });
    if (!client) throw new AppError('Associated client not found', 404);
  }

  // If caseId is provided, verify case exists
  if (data.caseId) {
    const caseRecord = await prisma.case.findUnique({ where: { id: data.caseId } });
    if (!caseRecord) throw new AppError('Associated case not found', 404);
    if (!targetClientId) {
      targetClientId = caseRecord.clientId;
    }
  }

  const document = await prisma.document.create({
    data: {
      title: data.title,
      docType: data.docType,
      category: data.category,
      clientId: targetClientId,
      caseId: data.caseId,
      fileKey: data.fileKey,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      visibility: (data.visibility as Visibility) || 'ADMIN_ONLY',
      description: data.description,
      tags: data.tags || [],
      uploadedById: uploadedBy.userId,
    },
    include: {
      client: { select: { id: true, clientId: true, fullName: true } },
      case: { select: { id: true, internalCaseId: true, title: true } },
      uploadedBy: {
        select: {
          id: true,
          email: true,
          role: true,
          client: { select: { fullName: true } },
        },
      },
    },
  });

  return document;
}

// ─── Update Document Visibility ───────────────────────────────────────────────

export async function updateDocumentVisibility(
  id: string,
  data: UpdateVisibilityInput,
  requestingUser: { role: Role }
) {
  if (requestingUser.role === 'CLIENT') {
    throw new AppError('Clients are not authorized to change document visibility', 403);
  }

  const existing = await prisma.document.findUnique({ where: { id } });
  if (!existing) throw new AppError('Document not found', 404);

  const updated = await prisma.document.update({
    where: { id },
    data: { visibility: data.visibility as Visibility },
    include: {
      client: { select: { id: true, clientId: true, fullName: true } },
      case: { select: { id: true, internalCaseId: true, title: true } },
      uploadedBy: {
        select: {
          id: true,
          email: true,
          role: true,
          client: { select: { fullName: true } },
        },
      },
    },
  });

  return updated;
}

// ─── Get Document by ID ───────────────────────────────────────────────────────

export async function getDocumentById(
  id: string,
  requestingUser: { userId: string; role: Role; clientId?: string }
) {
  const doc = await prisma.document.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, clientId: true, fullName: true } },
      case: { select: { id: true, internalCaseId: true, title: true } },
      uploadedBy: {
        select: {
          id: true,
          email: true,
          role: true,
          client: { select: { fullName: true } },
        },
      },
    },
  });

  if (!doc) throw new AppError('Document not found', 404);

  // Security check for client
  if (requestingUser.role === 'CLIENT') {
    if (doc.clientId !== requestingUser.clientId) {
      throw new AppError('Access denied', 403);
    }
    if (doc.visibility !== 'CLIENT_VISIBLE' && doc.uploadedById !== requestingUser.userId) {
      throw new AppError('Access denied', 403);
    }
  }

  return doc;
}

// ─── Delete Document ──────────────────────────────────────────────────────────

export async function deleteDocument(
  id: string,
  requestingUser: { userId: string; role: Role }
) {
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) throw new AppError('Document not found', 404);

  if (requestingUser.role === 'CLIENT' && doc.uploadedById !== requestingUser.userId) {
    throw new AppError('Cannot delete documents uploaded by administrator', 403);
  }

  // Delete file from storage
  try {
    await storage.deleteObject(doc.fileKey);
  } catch (err) {
    console.warn(`Failed to remove file from storage: ${doc.fileKey}`, err);
  }

  await prisma.document.delete({ where: { id } });
  return { success: true };
}
