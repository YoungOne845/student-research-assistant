import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';
import { signToken } from '../utils/jwt.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID || undefined);

export async function register(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email is already registered', 409);
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email, passwordHash }, select: safeUserSelect });
  return { user, token: signToken({ userId: user.id, role: user.role }) };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) throw new AppError('Invalid credentials', 401);
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError('Invalid credentials', 401);
  return { user: pickSafe(user), token: signToken({ userId: user.id, role: user.role }) };
}

export async function googleLogin(credential: string) {
  if (!env.GOOGLE_CLIENT_ID) throw new AppError('Google login is not configured', 503);
  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.email) throw new AppError('Google account email missing', 400);
  const user = await prisma.user.upsert({
    where: { email: payload.email },
    update: { googleId: payload.sub, avatarUrl: payload.picture, name: payload.name || payload.email },
    create: { email: payload.email, googleId: payload.sub, avatarUrl: payload.picture, name: payload.name || payload.email },
    select: safeUserSelect
  });
  return { user, token: signToken({ userId: user.id, role: user.role }) };
}

export async function createResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  const token = crypto.randomBytes(32).toString('hex');
  if (user) {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetTokenExpiresAt = new Date(Date.now() + env.RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);
    await prisma.user.update({ where: { id: user.id }, data: { resetTokenHash, resetTokenExpiresAt } });
  }
  return token;
}

export async function resetPassword(token: string, password: string) {
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await prisma.user.findFirst({ where: { resetTokenHash, resetTokenExpiresAt: { gt: new Date() } } });
  if (!user) throw new AppError('Invalid or expired reset token', 400);
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null } });
}

export const safeUserSelect = { id:true, email:true, name:true, role:true, avatarUrl:true, preferredFieldId:true, createdAt:true } as const;
function pickSafe(user: { id:string; email:string; name:string; role:string; avatarUrl:string|null; preferredFieldId:string|null; createdAt:Date }) {
  return { id:user.id, email:user.email, name:user.name, role:user.role, avatarUrl:user.avatarUrl, preferredFieldId:user.preferredFieldId, createdAt:user.createdAt };
}
