import { prisma } from '@/backend/infrastructure/db';

export async function getJobFamilies() {
  return prisma.jobFamily.findMany({
    include: { jobs: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getJobs(familyId?: string) {
  return prisma.job.findMany({
    where: familyId ? { jobFamilyId: familyId } : undefined,
    orderBy: { sortOrder: 'asc' },
  });
}

export async function searchSkills(query: string) {
  return prisma.skill.findMany({
    where: {
      OR: [
        { displayNameEn: { contains: query, mode: 'insensitive' } },
        {
          aliases: {
            some: { aliasNormalized: { contains: query, mode: 'insensitive' } },
          },
        },
      ],
    },
    take: 20,
  });
}

export async function getSkillById(id: string) {
  return prisma.skill.findUnique({
    where: { id },
    include: { aliases: true },
  });
}
