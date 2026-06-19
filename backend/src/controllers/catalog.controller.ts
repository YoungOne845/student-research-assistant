import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/catalog.service.js';

export const fields = asyncHandler(async (_req, res) => res.json({ fields: await service.getFields() }));
export const modules = asyncHandler(async (req, res) => res.json({ modules: await service.getModulesByField(req.params.fieldSlug) }));
