import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/errors.js';

export async function listProjects(userId: string, q?: string) {
  return prisma.researchProject.findMany({
    where: { userId, ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}) },
    include: { academicField: true, contents: { orderBy: { createdAt: 'desc' }, take: 3 } },
    orderBy: { updatedAt: 'desc' }
  });
}
export async function createProject(userId: string, academicFieldSlug: string, title: string, description: string, tags: string[]) {
  const field = await prisma.academicField.findUnique({ where: { slug: academicFieldSlug } });
  if (!field) throw new AppError('Academic field not found', 404);
  return prisma.researchProject.create({ data: { userId, academicFieldId: field.id, title, description, tags }, include: { academicField: true } });
}
export async function updateProject(userId: string, id: string, data: { title?: string; description?: string; tags?: string[]; status?: 'DRAFT'|'ACTIVE'|'ARCHIVED' }) {
  const project = await prisma.researchProject.findFirst({ where: { id, userId } });
  if (!project) throw new AppError('Project not found', 404);
  return prisma.researchProject.update({ where: { id }, data });
}
export async function deleteProject(userId: string, id: string) {
  const project = await prisma.researchProject.findFirst({ where: { id, userId } });
  if (!project) throw new AppError('Project not found', 404);
  await prisma.researchProject.delete({ where: { id } });
}
