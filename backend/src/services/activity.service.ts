import { prisma } from '../config/prisma.js';

export async function logActivity(userId: string, action: string, metadata?: unknown, ipAddress?: string, userAgent?: string) {
  await prisma.userActivityLog.create({ data: { userId, action, metadata: metadata as object, ipAddress, userAgent } });
}
