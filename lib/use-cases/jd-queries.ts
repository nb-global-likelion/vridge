import { prisma } from '@/lib/infrastructure/db';
import { notFound } from '@/lib/domain/errors';
import type { z } from 'zod';
import type { jobDescriptionFilterSchema } from '@/lib/validations/job-description';
import type { JobDescriptionWhereInput } from '@/lib/generated/prisma/models/JobDescription';

const JD_INCLUDE = {
  job: { include: { family: true } },
  skills: { include: { skill: true } },
  org: true,
} as const;

export async function getJobDescriptions(
  filters: z.infer<typeof jobDescriptionFilterSchema>
) {
  const {
    jobId,
    employmentType,
    workArrangement,
    search,
    familyId,
    page,
    pageSize,
  } = filters;

  const where: JobDescriptionWhereInput = {};
  if (jobId !== undefined) where.jobId = jobId;
  if (employmentType !== undefined) where.employmentType = employmentType;
  if (workArrangement !== undefined) where.workArrangement = workArrangement;
  if (search) where.title = { contains: search, mode: 'insensitive' };
  if (familyId) where.job = { is: { jobFamilyId: familyId } };

  const [items, total] = await Promise.all([
    prisma.jobDescription.findMany({
      where,
      include: JD_INCLUDE,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.jobDescription.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getJobDescriptionById(id: string) {
  const jd = await prisma.jobDescription.findUnique({
    where: { id },
    include: JD_INCLUDE,
  });
  if (!jd) throw notFound('채용공고');
  return jd;
}
