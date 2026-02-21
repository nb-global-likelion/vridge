import {
  getJobDescriptions,
  getJobDescriptionById,
} from '@/backend/use-cases/jd-queries';
import { DomainError } from '@/backend/domain/errors';
import { prisma } from '@/backend/infrastructure/db';

jest.mock('@/backend/infrastructure/db', () => ({
  prisma: {
    jobDescription: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

beforeEach(() => jest.clearAllMocks());

const mockJd = {
  id: 'jd-1',
  title: '프론트엔드 개발자',
  employmentType: 'full_time',
  workArrangement: 'remote',
  job: {
    id: 'frontend',
    displayNameEn: 'Frontend',
    family: { id: 'engineering' },
  },
  skills: [{ skill: { id: 'typescript', displayNameEn: 'TypeScript' } }],
  org: { id: 'org-1', name: 'Vridge' },
};

describe('getJobDescriptions', () => {
  beforeEach(() => {
    (prisma.jobDescription.findMany as unknown as jest.Mock).mockResolvedValue([
      mockJd,
    ]);
    (prisma.jobDescription.count as unknown as jest.Mock).mockResolvedValue(1);
  });

  it('기본 필터 없음 — 전체 목록 반환', async () => {
    const result = await getJobDescriptions({
      page: 1,
      pageSize: 20,
      sort: 'updated_desc',
    });

    expect(result).toEqual({
      items: [mockJd],
      total: 1,
      page: 1,
      pageSize: 20,
    });
    expect(prisma.jobDescription.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        skip: 0,
        take: 20,
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      })
    );
  });

  it('필터 적용 — where 조건 포함', async () => {
    await getJobDescriptions({
      jobId: 'frontend',
      employmentType: 'full_time',
      workArrangement: 'remote',
      page: 1,
      pageSize: 20,
      sort: 'updated_desc',
    });

    expect(prisma.jobDescription.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          jobId: 'frontend',
          employmentType: 'full_time',
          workArrangement: 'remote',
        },
      })
    );
  });

  it('미정의 필터는 where에 포함되지 않음', async () => {
    await getJobDescriptions({
      jobId: 'frontend',
      page: 1,
      pageSize: 20,
      sort: 'updated_desc',
    });

    const callArg = (prisma.jobDescription.findMany as unknown as jest.Mock)
      .mock.calls[0][0];
    expect(callArg.where).not.toHaveProperty('employmentType');
    expect(callArg.where).not.toHaveProperty('workArrangement');
  });

  it('search → where.title.contains (insensitive)', async () => {
    await getJobDescriptions({
      search: '프론트엔드',
      page: 1,
      pageSize: 20,
      sort: 'updated_desc',
    });

    const callArg = (prisma.jobDescription.findMany as unknown as jest.Mock)
      .mock.calls[0][0];
    expect(callArg.where.title).toEqual({
      contains: '프론트엔드',
      mode: 'insensitive',
    });
  });

  it('familyId → where.job.familyId', async () => {
    await getJobDescriptions({
      familyId: 'engineering',
      page: 1,
      pageSize: 20,
      sort: 'updated_desc',
    });

    const callArg = (prisma.jobDescription.findMany as unknown as jest.Mock)
      .mock.calls[0][0];
    expect(callArg.where.job).toEqual({ is: { jobFamilyId: 'engineering' } });
  });

  it('search, familyId 미전달 시 where에 포함되지 않음', async () => {
    await getJobDescriptions({ page: 1, pageSize: 20, sort: 'updated_desc' });

    const callArg = (prisma.jobDescription.findMany as unknown as jest.Mock)
      .mock.calls[0][0];
    expect(callArg.where).not.toHaveProperty('title');
    expect(callArg.where).not.toHaveProperty('job');
  });

  it('page 2 — skip: pageSize', async () => {
    await getJobDescriptions({ page: 2, pageSize: 10, sort: 'updated_desc' });

    expect(prisma.jobDescription.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10 })
    );
  });

  it('{ items, total, page, pageSize } 형태 반환', async () => {
    (prisma.jobDescription.count as unknown as jest.Mock).mockResolvedValue(42);

    const result = await getJobDescriptions({
      page: 3,
      pageSize: 5,
      sort: 'updated_desc',
    });

    expect(result.total).toBe(42);
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(5);
  });

  it('sort=created_desc면 createdAt 기준 정렬', async () => {
    await getJobDescriptions({
      page: 1,
      pageSize: 20,
      sort: 'created_desc',
    });

    expect(prisma.jobDescription.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      })
    );
  });
});

describe('getJobDescriptionById', () => {
  it('JD 반환', async () => {
    (
      prisma.jobDescription.findUnique as unknown as jest.Mock
    ).mockResolvedValue(mockJd);

    const result = await getJobDescriptionById('jd-1');

    expect(result).toEqual(mockJd);
    expect(prisma.jobDescription.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'jd-1' } })
    );
  });

  it('JD 없음 → DomainError throw', async () => {
    (
      prisma.jobDescription.findUnique as unknown as jest.Mock
    ).mockResolvedValue(null);

    await expect(getJobDescriptionById('nonexistent')).rejects.toThrow(
      DomainError
    );
  });
});
