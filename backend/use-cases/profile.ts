import { prisma } from '@/backend/infrastructure/db';
import { notFound, conflict } from '@/backend/domain/errors';
import { toDateOnlyUtc } from '@/backend/domain/date-only';
import type { z } from 'zod';
import type {
  profilePublicSchema,
  profilePrivateSchema,
  profileCareerSchema,
  profileEducationSchema,
  profileLanguageSchema,
  profileUrlSchema,
  profileCertificationSchema,
} from '@/backend/validations/profile';

const READONLY_PROFILE_INCLUDE = {
  authUser: { select: { email: true } },
  profilePublic: true,
  careers: { include: { job: true }, orderBy: { sortOrder: 'asc' } },
  educations: { orderBy: { sortOrder: 'asc' } },
  languages: { orderBy: { sortOrder: 'asc' } },
  urls: { orderBy: { sortOrder: 'asc' } },
  profileSkills: { include: { skill: true } },
  certifications: { orderBy: { sortOrder: 'asc' } },
} as const;

function toPublicProfileWriteData(data: z.infer<typeof profilePublicSchema>) {
  return data.dateOfBirth
    ? { ...data, dateOfBirth: toDateOnlyUtc(data.dateOfBirth) }
    : data;
}

function toCareerWriteData(data: z.infer<typeof profileCareerSchema>) {
  return {
    ...data,
    startDate: toDateOnlyUtc(data.startDate),
    endDate: data.endDate ? toDateOnlyUtc(data.endDate) : undefined,
  };
}

function toEducationWriteData(data: z.infer<typeof profileEducationSchema>) {
  return {
    ...data,
    startDate: toDateOnlyUtc(data.startDate),
    endDate: data.endDate ? toDateOnlyUtc(data.endDate) : undefined,
  };
}

function toCertificationWriteData(
  data: z.infer<typeof profileCertificationSchema>
) {
  return {
    ...data,
    date: toDateOnlyUtc(data.date),
  };
}

export async function getFullProfile(userId: string) {
  const profile = await prisma.appUser.findUnique({
    where: { id: userId },
    include: {
      profilePublic: true,
      profilePrivate: true,
      careers: { include: { job: true }, orderBy: { sortOrder: 'asc' } },
      educations: { orderBy: { sortOrder: 'asc' } },
      languages: { orderBy: { sortOrder: 'asc' } },
      urls: { orderBy: { sortOrder: 'asc' } },
      profileSkills: { include: { skill: true } },
      attachments: true,
      certifications: { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!profile) throw notFound('프로필');
  return profile;
}

export async function getProfileForViewer(
  candidateId: string,
  mode: 'partial' | 'full'
) {
  const baseInclude = {
    ...READONLY_PROFILE_INCLUDE,
    authUser: false,
  } as const;

  const include =
    mode === 'full'
      ? { ...baseInclude, profilePrivate: true, attachments: true }
      : baseInclude;

  const profile = await prisma.appUser.findUnique({
    where: { id: candidateId },
    include,
  });
  if (!profile) throw notFound('프로필');
  return profile;
}

export async function getProfileBySlug(slug: string) {
  const profile = await prisma.appUser.findFirst({
    where: {
      profilePublic: {
        is: { publicSlug: slug },
      },
    },
    include: READONLY_PROFILE_INCLUDE,
  });
  if (!profile || !profile.profilePublic?.isPublic) throw notFound('프로필');
  return profile;
}

export async function updatePublicProfile(
  userId: string,
  data: z.infer<typeof profilePublicSchema>
) {
  return prisma.profilesPublic.update({
    where: { userId },
    data: toPublicProfileWriteData(data),
  });
}

export async function updatePrivateProfile(
  userId: string,
  data: z.infer<typeof profilePrivateSchema>
) {
  return prisma.profilesPrivate.update({ where: { userId }, data });
}

export async function addCareer(
  userId: string,
  data: z.infer<typeof profileCareerSchema>
) {
  return prisma.profileCareer.create({
    data: { ...toCareerWriteData(data), userId },
  });
}

export async function updateCareer(
  userId: string,
  id: string,
  data: z.infer<typeof profileCareerSchema>
) {
  const existing = await prisma.profileCareer.findFirst({
    where: { id, userId },
  });
  if (!existing) throw notFound('경력');
  return prisma.profileCareer.update({
    where: { id },
    data: toCareerWriteData(data),
  });
}

export async function deleteCareer(userId: string, id: string) {
  const existing = await prisma.profileCareer.findFirst({
    where: { id, userId },
  });
  if (!existing) throw notFound('경력');
  return prisma.profileCareer.delete({ where: { id } });
}

export async function addEducation(
  userId: string,
  data: z.infer<typeof profileEducationSchema>
) {
  return prisma.profileEducation.create({
    data: { ...toEducationWriteData(data), userId },
  });
}

export async function updateEducation(
  userId: string,
  id: string,
  data: z.infer<typeof profileEducationSchema>
) {
  const existing = await prisma.profileEducation.findFirst({
    where: { id, userId },
  });
  if (!existing) throw notFound('학력');
  return prisma.profileEducation.update({
    where: { id },
    data: toEducationWriteData(data),
  });
}

export async function deleteEducation(userId: string, id: string) {
  const existing = await prisma.profileEducation.findFirst({
    where: { id, userId },
  });
  if (!existing) throw notFound('학력');
  return prisma.profileEducation.delete({ where: { id } });
}

export async function addLanguage(
  userId: string,
  data: z.infer<typeof profileLanguageSchema>
) {
  return prisma.profileLanguage.create({ data: { ...data, userId } });
}

export async function updateLanguage(
  userId: string,
  id: string,
  data: z.infer<typeof profileLanguageSchema>
) {
  const existing = await prisma.profileLanguage.findFirst({
    where: { id, userId },
  });
  if (!existing) throw notFound('언어');
  return prisma.profileLanguage.update({ where: { id }, data });
}

export async function deleteLanguage(userId: string, id: string) {
  const existing = await prisma.profileLanguage.findFirst({
    where: { id, userId },
  });
  if (!existing) throw notFound('언어');
  return prisma.profileLanguage.delete({ where: { id } });
}

export async function addUrl(
  userId: string,
  data: z.infer<typeof profileUrlSchema>
) {
  return prisma.profileUrl.create({ data: { ...data, userId } });
}

export async function updateUrl(
  userId: string,
  id: string,
  data: z.infer<typeof profileUrlSchema>
) {
  const existing = await prisma.profileUrl.findFirst({ where: { id, userId } });
  if (!existing) throw notFound('URL');
  return prisma.profileUrl.update({ where: { id }, data });
}

export async function deleteUrl(userId: string, id: string) {
  const existing = await prisma.profileUrl.findFirst({ where: { id, userId } });
  if (!existing) throw notFound('URL');
  return prisma.profileUrl.delete({ where: { id } });
}

export async function addCertification(
  userId: string,
  data: z.infer<typeof profileCertificationSchema>
) {
  return prisma.profileCertification.create({
    data: { ...toCertificationWriteData(data), userId },
  });
}

export async function updateCertification(
  userId: string,
  id: string,
  data: z.infer<typeof profileCertificationSchema>
) {
  const existing = await prisma.profileCertification.findFirst({
    where: { id, userId },
  });
  if (!existing) throw notFound('자격증');
  return prisma.profileCertification.update({
    where: { id },
    data: toCertificationWriteData(data),
  });
}

export async function deleteCertification(userId: string, id: string) {
  const existing = await prisma.profileCertification.findFirst({
    where: { id, userId },
  });
  if (!existing) throw notFound('자격증');
  return prisma.profileCertification.delete({ where: { id } });
}

export async function addSkill(userId: string, skillId: string) {
  try {
    return await prisma.profileSkill.create({ data: { userId, skillId } });
  } catch (e) {
    if ((e as { code?: string }).code === 'P2002') {
      throw conflict('이미 추가된 스킬입니다');
    }
    throw e;
  }
}

export async function deleteSkill(userId: string, skillId: string) {
  return prisma.profileSkill.deleteMany({ where: { userId, skillId } });
}
