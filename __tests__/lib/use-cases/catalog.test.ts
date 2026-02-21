import {
  getJobFamilies,
  getJobs,
  searchSkills,
  getSkillById,
} from '@/backend/use-cases/catalog';
import { prisma } from '@/backend/infrastructure/db';

jest.mock('@/backend/infrastructure/db', () => ({
  prisma: {
    jobFamily: { findMany: jest.fn() },
    job: { findMany: jest.fn() },
    skill: { findMany: jest.fn(), findUnique: jest.fn() },
  },
}));

beforeEach(() => jest.clearAllMocks());

describe('getJobFamilies', () => {
  it('패밀리 + 직무 목록 반환', async () => {
    const mockFamilies = [
      {
        id: 'engineering',
        displayNameEn: 'Engineering',
        sortOrder: 0,
        jobs: [{ id: 'frontend', displayNameEn: 'Frontend', sortOrder: 0 }],
      },
    ];
    (prisma.jobFamily.findMany as unknown as jest.Mock).mockResolvedValue(
      mockFamilies
    );

    const result = await getJobFamilies();

    expect(result).toEqual(mockFamilies);
    expect(prisma.jobFamily.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({ jobs: expect.any(Object) }),
        orderBy: { sortOrder: 'asc' },
      })
    );
  });
});

describe('getJobs', () => {
  it('familyId 없음 → where 조건 없이 전체 조회', async () => {
    const mockJobs = [{ id: 'frontend', displayNameEn: 'Frontend' }];
    (prisma.job.findMany as unknown as jest.Mock).mockResolvedValue(mockJobs);

    const result = await getJobs();

    expect(result).toEqual(mockJobs);
    expect(prisma.job.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: undefined })
    );
  });

  it('familyId 있음 → jobFamilyId 필터 적용', async () => {
    const mockJobs = [{ id: 'frontend', displayNameEn: 'Frontend' }];
    (prisma.job.findMany as unknown as jest.Mock).mockResolvedValue(mockJobs);

    await getJobs('engineering');

    expect(prisma.job.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { jobFamilyId: 'engineering' } })
    );
  });
});

describe('searchSkills', () => {
  it('쿼리로 스킬 검색 — ILIKE + 최대 20개', async () => {
    const mockSkills = [{ id: 'typescript', displayNameEn: 'TypeScript' }];
    (prisma.skill.findMany as unknown as jest.Mock).mockResolvedValue(
      mockSkills
    );

    const result = await searchSkills('type');

    expect(result).toEqual(mockSkills);
    expect(prisma.skill.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            {
              displayNameEn: {
                contains: 'type',
                mode: 'insensitive',
              },
            },
            {
              aliases: {
                some: {
                  aliasNormalized: {
                    contains: 'type',
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        },
        take: 20,
      })
    );
  });
});

describe('getSkillById', () => {
  it('스킬 + aliases 반환', async () => {
    const mockSkill = {
      id: 'typescript',
      displayNameEn: 'TypeScript',
      aliases: [{ id: 'alias-1', alias: 'ts', aliasNormalized: 'ts' }],
    };
    (prisma.skill.findUnique as unknown as jest.Mock).mockResolvedValue(
      mockSkill
    );

    const result = await getSkillById('typescript');

    expect(result).toEqual(mockSkill);
    expect(prisma.skill.findUnique).toHaveBeenCalledWith({
      where: { id: 'typescript' },
      include: { aliases: true },
    });
  });

  it('스킬 없음 → null 반환 (throw 없음)', async () => {
    (prisma.skill.findUnique as unknown as jest.Mock).mockResolvedValue(null);

    const result = await getSkillById('nonexistent');

    expect(result).toBeNull();
  });
});
