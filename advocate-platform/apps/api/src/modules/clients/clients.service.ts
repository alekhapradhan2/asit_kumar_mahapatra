import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import { hashPassword } from '../auth/auth.service';
import type { CreateClientInput, UpdateClientInput, ClientQuery } from './clients.schemas';
import { nanoid } from 'nanoid';

// ─── Generate unique CLIENT-XXXXXX ID ────────────────────────────────────────

async function generateClientId(): Promise<string> {
  let attempts = 0;
  while (attempts < 10) {
    const id = `CLIENT-${nanoid(6).toUpperCase()}`;
    const existing = await prisma.client.findUnique({ where: { clientId: id } });
    if (!existing) return id;
    attempts++;
  }
  throw new AppError('Failed to generate unique Client ID', 500);
}

// ─── Create Client ────────────────────────────────────────────────────────────

export async function createClient(data: CreateClientInput) {
  // Check for duplicate email
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });
  if (existingUser) {
    throw new AppError('A user with this email already exists', 409);
  }

  const clientId = await generateClientId();
  const passwordHash = await hashPassword(data.password);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        role: 'CLIENT',
        mustChangePass: true, // Force password change on first login
      },
    });

    const client = await tx.client.create({
      data: {
        clientId,
        userId: user.id,
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        mobile: data.mobile,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country || 'India',
        pinCode: data.pinCode,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        emergencyName: data.emergencyName,
        emergencyPhone: data.emergencyPhone,
      },
    });

    return client;
  });

  return getClientById(result.id);
}

// ─── List Clients ─────────────────────────────────────────────────────────────

export async function listClients(query: ClientQuery) {
  const { page, limit, search, isActive, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ClientWhereInput = {};

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { clientId: { contains: search.toUpperCase() } },
      { mobile: { contains: search } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        clientId: true,
        fullName: true,
        email: true,
        mobile: true,
        city: true,
        state: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        profilePhoto: true,
        user: { select: { lastLoginAt: true } },
        _count: { select: { cases: true } },
      },
    }),
    prisma.client.count({ where }),
  ]);

  return { clients, total };
}

// ─── Get Client by ID ─────────────────────────────────────────────────────────

export async function getClientById(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, email: true, role: true, lastLoginAt: true, isActive: true, createdAt: true },
      },
      cases: {
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          internalCaseId: true,
          title: true,
          caseType: true,
          practiceArea: true,
          courtName: true,
          courtLocation: true,
          caseNumber: true,
          cnrNumber: true,
          currentStatus: true,
          caseStage: true,
          nextHearingDate: true,
          priority: true,
          isArchived: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      documents: {
        orderBy: { uploadedAt: 'desc' },
        include: {
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
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 50,
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
      },
      _count: { select: { cases: true, documents: true, messages: true } },
    },
  });

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  // Remove sensitive fields
  const { govIdRef, ...safeClient } = client;
  void govIdRef; // intentionally excluded

  return safeClient;
}


// ─── Update Client ────────────────────────────────────────────────────────────

export async function updateClient(id: string, data: UpdateClientInput) {
  await getClientById(id); // Ensure exists

  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email.toLowerCase(), NOT: { client: { id } } },
    });
    if (existing) {
      throw new AppError('Email already in use by another account', 409);
    }
  }

  const updated = await prisma.client.update({
    where: { id },
    data: {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.email && { email: data.email.toLowerCase() }),
      ...(data.mobile && { mobile: data.mobile }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.state !== undefined && { state: data.state }),
      ...(data.country && { country: data.country }),
      ...(data.pinCode !== undefined && { pinCode: data.pinCode }),
      ...(data.emergencyName !== undefined && { emergencyName: data.emergencyName }),
      ...(data.emergencyPhone !== undefined && { emergencyPhone: data.emergencyPhone }),
    },
  });

  // Handle account status change separately (also updates user)
  if (data.isActive !== undefined) {
    await prisma.$transaction([
      prisma.client.update({ where: { id }, data: { isActive: data.isActive } }),
      prisma.user.update({
        where: { id: updated.userId },
        data: { isActive: data.isActive },
      }),
    ]);
  }

  return getClientById(id);
}

// ─── Delete (Soft Disable) ────────────────────────────────────────────────────

export async function disableClient(id: string) {
  await getClientById(id);

  await prisma.$transaction(async (tx) => {
    const client = await tx.client.update({
      where: { id },
      data: { isActive: false },
    });
    await tx.user.update({
      where: { id: client.userId },
      data: { isActive: false },
    });
    // Revoke all refresh tokens
    await tx.refreshToken.updateMany({
      where: { userId: client.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  });
}

// ─── Get Client Cases ─────────────────────────────────────────────────────────

export async function getClientCases(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true },
  });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.case.findMany({
    where: { clientId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      internalCaseId: true,
      title: true,
      caseType: true,
      practiceArea: true,
      courtName: true,
      currentStatus: true,
      nextHearingDate: true,
      priority: true,
      isArchived: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
