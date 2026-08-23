import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendPaginated } from '../../utils/response';
import * as documentsService from './documents.service';
import { storage } from '../../config/storage';
import { AppError } from '../../utils/AppError';
import { nanoid } from 'nanoid';
import path from 'path';

export async function listDocuments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requestingUser = {
      userId: req.user!.sub,
      role: req.user!.role,
      clientId: req.user!.clientId,
    };
    const { documents, total } = await documentsService.listDocuments(
      req.query as any,
      requestingUser
    );
    sendPaginated(
      res,
      documents,
      total,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 50,
      'Documents retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

export async function uploadDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      throw new AppError('File is required for upload', 400);
    }

    const ext = path.extname(file.originalname);
    const key = `docs/${Date.now()}-${nanoid(10)}${ext}`;

    // Save file buffer
    storage.saveLocal(key, file.buffer);

    const requestingUser = {
      userId: req.user!.sub,
      role: req.user!.role,
      clientId: req.user!.clientId,
    };

    const doc = await documentsService.createDocument(
      {
        title: req.body.title || file.originalname,
        docType: req.body.docType || 'OTHER',
        category: req.body.category,
        clientId: req.body.clientId,
        caseId: req.body.caseId,
        visibility: req.body.visibility || 'ADMIN_ONLY',
        description: req.body.description,
        tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [],
        fileKey: key,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      },
      requestingUser
    );

    sendSuccess(res, doc, 'Document uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateVisibility(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requestingUser = { role: req.user!.role };
    const doc = await documentsService.updateDocumentVisibility(
      req.params.id,
      req.body,
      requestingUser
    );
    sendSuccess(res, doc, 'Document visibility updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function getDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requestingUser = {
      userId: req.user!.sub,
      role: req.user!.role,
      clientId: req.user!.clientId,
    };
    const doc = await documentsService.getDocumentById(req.params.id, requestingUser);
    sendSuccess(res, doc, 'Document details retrieved');
  } catch (error) {
    next(error);
  }
}

export async function downloadDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requestingUser = {
      userId: req.user!.sub,
      role: req.user!.role,
      clientId: req.user!.clientId,
    };
    const doc = await documentsService.getDocumentById(req.params.id, requestingUser);
    
    // Read local file buffer or redirect to signed URL
    try {
      const buffer = storage.readLocal(doc.fileKey);
      res.setHeader('Content-Type', doc.mimeType);
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${encodeURIComponent(doc.title)}${path.extname(doc.fileKey)}"`
      );
      res.send(buffer);
    } catch {
      // Fallback to presigned URL if configured with S3
      const downloadUrl = await storage.getDownloadPresignedUrl(doc.fileKey);
      res.redirect(downloadUrl);
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requestingUser = {
      userId: req.user!.sub,
      role: req.user!.role,
    };
    const result = await documentsService.deleteDocument(req.params.id, requestingUser);
    sendSuccess(res, result, 'Document deleted successfully');
  } catch (error) {
    next(error);
  }
}
