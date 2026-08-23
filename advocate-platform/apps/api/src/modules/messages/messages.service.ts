import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import type { Role } from '@advocate/shared-types';
import type { MessageQuery, CreateMessageInput } from './messages.schemas';

// ─── List Messages ────────────────────────────────────────────────────────────

export async function listMessages(
  query: MessageQuery,
  requestingUser: { userId: string; role: Role; clientId?: string }
) {
  const { page, limit, clientId } = query;
  const skip = (page - 1) * limit;

  let targetClientId = clientId;

  if (requestingUser.role === 'CLIENT') {
    if (!requestingUser.clientId) {
      throw new AppError('Client record not found for user', 403);
    }
    targetClientId = requestingUser.clientId;
  }

  if (!targetClientId) {
    throw new AppError('clientId is required to view messages', 400);
  }

  const where: Prisma.MessageWhereInput = {
    clientId: targetClientId,
  };

  if (requestingUser.role === 'CLIENT') {
    where.isClientVisible = true;
  }

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            client: { select: { fullName: true } },
          },
        },
      },
    }),
    prisma.message.count({ where }),
  ]);

  return { messages, total };
}

// ─── Send Message ─────────────────────────────────────────────────────────────

export async function sendMessage(
  data: CreateMessageInput,
  sender: { userId: string; role: Role; clientId?: string }
) {
  let targetClientId = data.clientId;

  if (sender.role === 'CLIENT') {
    targetClientId = sender.clientId;
  }

  if (!targetClientId) {
    throw new AppError('clientId is required to send message', 400);
  }

  // Ensure client exists
  const client = await prisma.client.findUnique({
    where: { id: targetClientId },
    include: { user: true },
  });
  if (!client) throw new AppError('Client not found', 404);

  const message = await prisma.message.create({
    data: {
      clientId: targetClientId,
      senderId: sender.userId,
      senderRole: sender.role,
      subject: data.subject,
      content: data.content,
      isClientVisible: sender.role === 'CLIENT' ? true : data.isClientVisible,
      attachments: data.attachments,
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          role: true,
          client: { select: { fullName: true } },
        },
      },
    },
  });

  return message;
}

// ─── Mark Messages As Read ───────────────────────────────────────────────────

export async function markMessagesAsRead(
  clientId: string,
  requestingUser: { userId: string; role: Role; clientId?: string }
) {
  let targetClientId = clientId;
  if (requestingUser.role === 'CLIENT') {
    targetClientId = requestingUser.clientId!;
  }

  await prisma.message.updateMany({
    where: {
      clientId: targetClientId,
      senderId: { not: requestingUser.userId },
      isRead: false,
    },
    data: { isRead: true },
  });

  return { success: true };
}
