import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/errors.js';
import { verifyToken } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request { user?: { id: string; email: string; role: string; name: string } }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new AppError('Authentication required', 401);
    const token = header.slice(7);
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id:true,email:true,role:true,name:true } });
    if (!user) throw new AppError('User not found', 401);
    req.user = user;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}
