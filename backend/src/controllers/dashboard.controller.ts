import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const dashboard = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const [projectCount, generatedCount, recentProjects, activities, notifications] = await Promise.all([
    prisma.researchProject.count({ where: { userId } }),
    prisma.generatedContent.count({ where: { userId } }),
    prisma.researchProject.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }, take: 5 }),
    prisma.userActivityLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 })
  ]);
  res.json({ stats: { projectCount, generatedCount }, recentProjects, activities, notifications });
});
