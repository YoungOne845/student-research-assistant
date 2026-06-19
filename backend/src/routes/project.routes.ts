import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as controller from '../controllers/project.controller.js';
export const projectRouter = Router();
projectRouter.use(requireAuth);
projectRouter.get('/', controller.list);
projectRouter.post('/', controller.create);
projectRouter.patch('/:id', controller.update);
projectRouter.delete('/:id', controller.remove);
