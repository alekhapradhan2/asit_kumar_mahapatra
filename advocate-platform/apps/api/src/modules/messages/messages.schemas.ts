import { z } from 'zod';

export const messageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  clientId: z.string().optional(),
});

export const createMessageSchema = z.object({
  clientId: z.string().optional(),
  subject: z.string().max(200).optional(),
  content: z.string().min(1, 'Message content is required').max(10000),
  isClientVisible: z.boolean().default(true),
  attachments: z.any().optional(),
});

export type MessageQuery = z.infer<typeof messageQuerySchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
