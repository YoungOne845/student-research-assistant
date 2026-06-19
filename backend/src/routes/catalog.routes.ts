import { Router } from 'express';
import * as controller from '../controllers/catalog.controller.js';
export const catalogRouter = Router();
catalogRouter.get('/fields', controller.fields);
catalogRouter.get('/fields/:fieldSlug/modules', controller.modules);
