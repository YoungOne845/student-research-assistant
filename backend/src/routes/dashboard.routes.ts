import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as controller from '../controllers/dashboard.controller.js';
export const dashboardRouter = Router();
dashboardRouter.get('/', requireAuth, controller.dashboard);
