import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/security.js';
import * as controller from '../controllers/ai.controller.js';
export const aiRouter = Router();
aiRouter.post('/generate', requireAuth, aiLimiter, controller.generate);
