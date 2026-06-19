import { prisma } from '../config/prisma.js';

export async function getFields() {
  return prisma.academicField.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
}

export async function getModulesByField(fieldSlug: string) {
  const field = await prisma.academicField.findUnique({ where: { slug: fieldSlug } });
  if (!field) return [];
  const links = await prisma.academicFieldModule.findMany({
    where: { academicFieldId: field.id, enabled: true, researchModule: { isActive: true } },
    include: { researchModule: true },
    orderBy: { researchModule: { orderIndex: 'asc' } }
  });
  return links.map(link => link.researchModule);
}
