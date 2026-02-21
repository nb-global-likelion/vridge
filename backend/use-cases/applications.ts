import { prisma } from '@/backend/infrastructure/db';
import { notFound, conflict } from '@/backend/domain/errors';
import { assertOwnership } from '@/backend/domain/authorization';

// 지원자 프로필 포함 (부분 조회 — 채용담당자 뷰)
// AppUser에서 profilePublic(기본 정보)과 profileSkills(스킬 목록)를 직접 조회
const APPLY_CANDIDATE_INCLUDE = {
  user: {
    include: {
      profilePublic: true,
      profileSkills: { include: { skill: true } },
    },
  },
} as const;

export async function createApplication(userId: string, jdId: string) {
  const jd = await prisma.jobDescription.findUnique({ where: { id: jdId } });
  if (!jd) throw notFound('채용공고');

  const existing = await prisma.apply.findFirst({ where: { userId, jdId } });
  if (existing) throw conflict('이미 지원한 채용공고입니다');

  return prisma.apply.create({ data: { userId, jdId, status: 'applied' } });
}

export async function withdrawApplication(userId: string, applyId: string) {
  const apply = await prisma.apply.findUnique({ where: { id: applyId } });
  if (!apply) throw notFound('지원');

  assertOwnership(userId, apply.userId);

  if (apply.status !== 'applied') {
    throw conflict('지원 취소는 지원 상태에서만 가능합니다');
  }

  return prisma.apply.update({
    where: { id: applyId },
    data: { status: 'withdrawn' },
  });
}

export async function getUserApplications(userId: string) {
  return prisma.apply.findMany({
    where: { userId },
    include: {
      jd: {
        include: {
          job: { include: { family: true } },
          org: true,
          skills: { include: { skill: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getApplicationsForJd(jdId: string) {
  return prisma.apply.findMany({
    where: { jdId },
    include: APPLY_CANDIDATE_INCLUDE,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getApplicantStats(jdId: string) {
  return prisma.apply.groupBy({
    by: ['status'],
    where: { jdId },
    _count: { _all: true },
  });
}
