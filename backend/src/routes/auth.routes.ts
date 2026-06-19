import { Router } from 'express';
import { authLimiter } from '../middleware/security.js';
import { requireAuth } from '../middleware/auth.js';
import * as controller from '../controllers/auth.controller.js';

export const authRouter = Router();
authRouter.post('/register', authLimiter, controller.register);
authRouter.post('/login', authLimiter, controller.login);
authRouter.post('/google', authLimiter, controller.google);
authRouter.get('/me', requireAuth, controller.me);
authRouter.post('/forgot-password', authLimiter, controller.forgotPassword);
authRouter.post('/reset-password', authLimiter, controller.resetPassword);
