import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import type { AuthTokenPayload } from '@advocate/shared-types';

const BCRYPT_ROUNDS = 12;

// ─── Token Utilities ─────────────────────────────────────────────────────────

export function generateAccessToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ─── Admin Login ─────────────────────────────────────────────────────────────

export async function adminLogin(
  email: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
      isActive: true,
      mustChangePass: true,
    },
  });

  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account has been deactivated', 401);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const accessToken = generateAccessToken({
    sub: user.id,
    role: user.role as 'SUPER_ADMIN' | 'ADMIN',
  });

  const refreshToken = await createRefreshToken(user.id, ipAddress, userAgent);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      mustChangePass: user.mustChangePass,
    },
  };
}

// ─── Client Login ─────────────────────────────────────────────────────────────

export async function clientLogin(
  identifier: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
) {
  const trimmed = identifier.trim();
  const isEmail = trimmed.includes('@');

  const client = await prisma.client.findFirst({
    where: isEmail
      ? { email: trimmed.toLowerCase() }
      : {
          OR: [
            { clientId: trimmed.toUpperCase() },
            { email: trimmed.toLowerCase() },
          ],
        },
    include: {
      user: {
        select: {
          id: true,
          passwordHash: true,
          role: true,
          isActive: true,
          mustChangePass: true,
        },
      },
    },
  });

  if (!client) {
    // Use same error to prevent client ID enumeration
    throw new AppError('Invalid credentials', 401);
  }

  if (!client.isActive || !client.user.isActive) {
    throw new AppError('Account has been deactivated. Please contact the Advocate.', 401);
  }

  const valid = await verifyPassword(password, client.user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update last login
  await prisma.user.update({
    where: { id: client.user.id },
    data: { lastLoginAt: new Date() },
  });

  const accessToken = generateAccessToken({
    sub: client.user.id,
    role: 'CLIENT',
    clientId: client.id,
  });

  const refreshToken = await createRefreshToken(client.user.id, ipAddress, userAgent);

  return {
    accessToken,
    refreshToken,
    user: {
      id: client.user.id,
      email: client.email,
      role: 'CLIENT',
      clientId: client.clientId,
      fullName: client.fullName,
      mustChangePass: client.user.mustChangePass,
    },
  };
}

// ─── Refresh Token Flow ───────────────────────────────────────────────────────

export async function createRefreshToken(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  const token = generateRefreshToken();
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      userAgent,
    },
  });

  return token;
}

export async function rotateRefreshToken(
  incomingToken: string,
  ipAddress?: string,
  userAgent?: string
) {
  const tokenHash = crypto.createHash('sha256').update(incomingToken).digest('hex');

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: { id: true, role: true, isActive: true },
      },
    },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    // Potential token reuse — revoke all tokens for safety
    if (stored) {
      await prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    throw new AppError('Invalid refresh token', 401);
  }

  if (!stored.user.isActive) {
    throw new AppError('Account inactive', 401);
  }

  // Revoke the used token
  await prisma.refreshToken.update({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  });

  // Issue new access + refresh tokens
  const client = await prisma.client.findUnique({
    where: { userId: stored.userId },
    select: { id: true, clientId: true },
  });

  const accessToken = generateAccessToken({
    sub: stored.userId,
    role: stored.user.role as AuthTokenPayload['role'],
    ...(client ? { clientId: client.id } : {}),
  });

  const newRefreshToken = await createRefreshToken(stored.userId, ipAddress, userAgent);

  return { accessToken, refreshToken: newRefreshToken };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
