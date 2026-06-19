import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/project.service.js';

const createSchema = z.object({ academicFieldSlug: z.string(), title: z.string().min(3), description: z.string().default(''), tags: z.array(z.string()).default([]) });
const updateSchema = z.object({ title: z.string().min(3).optional(), description: z.string().optional(), tags: z.array(z.string()).optional(), status: z.enum(['DRAFT','ACTIVE','ARCHIVED']).optional() });

export const list = asyncHandler(async (req, res) => res.json({ projects: await service.listProjects(req.user!.id, String(req.query.q || '')) }));
export const create = asyncHandler(async (req, res) => { const data = createSchema.parse(req.body); res.status(201).json({ project: await service.createProject(req.user!.id, data.academicFieldSlug, data.title, data.description, data.tags) }); });
export const update = asyncHandler(async (req, res) => res.json({ project: await service.updateProject(req.user!.id, req.params.id, updateSchema.parse(req.body)) }));
export const remove = asyncHandler(async (req, res) => { await service.deleteProject(req.user!.id, req.params.id); res.status(204).send(); });
