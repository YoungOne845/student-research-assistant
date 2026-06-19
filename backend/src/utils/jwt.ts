import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export type TokenPayload = {
  userId: string;
  role: string;
};

const jwtSecret: Secret = env.JWT_SECRET;

const jwtOptions: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn']
};

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, jwtSecret, jwtOptions);
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtSecret) as TokenPayload;
}