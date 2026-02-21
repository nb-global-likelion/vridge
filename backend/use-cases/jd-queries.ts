import { prisma } from '@/backend/infrastructure/db';
import { notFound } from '@/backend/domain/errors';
import type { z } from 'zod';
import type { jobDescriptionFilterSchema } from '@/backend/validations/job-description';
import type { JobDescriptionWhereInput } from '@/backend/generated/prisma/models/JobDescription';

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
    sort,
    page,
    pageSize,
  } = filters;

  const where: JobDescriptionWhereInput = {};
  if (jobId !== undefined) where.jobId = jobId;
  if (employmentType !== undefined) where.employmentType = employmentType;
  if (workArrangement !== undefined) where.workArrangement = workArrangement;
  if (search) where.title = { contains: search, mode: 'insensitive' };
  if (familyId) where.job = { is: { jobFamilyId: familyId } };

  const orderBy =
    sort === 'created_desc'
      ? [{ createdAt: 'desc' as const }, { id: 'desc' as const }]
      : [{ updatedAt: 'desc' as const }, { id: 'desc' as const }];

  const [items, total] = await Promise.all([
    prisma.jobDescription.findMany({
      where,
      include: JD_INCLUDE,
      orderBy,
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
