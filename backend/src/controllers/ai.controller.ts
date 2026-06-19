import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateContent } from '../services/ai.service.js';

const schema = z.object({
  academicFieldSlug: z.string().min(1),
  researchModuleSlug: z.string().min(1),
  projectId: z.string().optional(),
  input: z.record(z.unknown()).default({})
});

export const generate = asyncHandler(async (req, res) => {
  const data = schema.parse(req.body);
  const generated = await generateContent({ ...data, userId: req.user!.id });
  res.status(201).json({ generated });
});
