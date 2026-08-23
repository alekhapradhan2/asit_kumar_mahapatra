import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendPaginated } from '../../utils/response';
import * as messagesService from './messages.service';

export async function listMessages(
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
    const { messages, total } = await messagesService.listMessages(
      req.query as any,
      requestingUser
    );
    sendPaginated(
      res,
      messages,
      total,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 50,
      'Messages retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const sender = {
      userId: req.user!.sub,
      role: req.user!.role,
      clientId: req.user!.clientId,
    };
    const message = await messagesService.sendMessage(req.body, sender);
    sendSuccess(res, message, 'Message sent successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(
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
    const result = await messagesService.markMessagesAsRead(
      req.params.clientId,
      requestingUser
    );
    sendSuccess(res, result, 'Messages marked as read');
  } catch (error) {
    next(error);
  }
}
