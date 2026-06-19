import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type TokenPayload = { userId: string; role: string };

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
