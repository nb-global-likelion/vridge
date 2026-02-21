import {
  createApplication,
  withdrawApplication,
  getUserApplications,
  getApplicationsForJd,
  getApplicantStats,
} from '@/backend/use-cases/applications';
import { DomainError } from '@/backend/domain/errors';
import { prisma } from '@/backend/infrastructure/db';

jest.mock('@/backend/infrastructure/db', () => ({
  prisma: {
    apply: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      groupBy: jest.fn(),
    },
    jobDescription: {
      findUnique: jest.fn(),
    },
  },
}));

beforeEach(() => jest.clearAllMocks());

const userId = 'user-1';
const jdId = 'jd-1';
const applyId = 'apply-1';

const mockApply = {
  id: applyId,
  userId,
  jdId,
  status: 'applied',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockJd = { id: jdId, title: '백엔드 개발자' };

describe('createApplication', () => {
  it('정상 지원 — apply 생성', async () => {
    (
      prisma.jobDescription.findUnique as unknown as jest.Mock
    ).mockResolvedValue(mockJd);
    (prisma.apply.findFirst as unknown as jest.Mock).mockResolvedValue(null);
    (prisma.apply.create as unknown as jest.Mock).mockResolvedValue(mockApply);

    const result = await createApplication(userId, jdId);

    expect(result).toEqual(mockApply);
    expect(prisma.apply.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { userId, jdId, status: 'applied' } })
    );
  });

  it('JD 없음 → DomainError NOT_FOUND', async () => {
    (
      prisma.jobDescription.findUnique as unknown as jest.Mock
    ).mockResolvedValue(null);

    await expect(createApplication(userId, jdId)).rejects.toThrow(DomainError);
    await expect(createApplication(userId, jdId)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('중복 지원 → DomainError CONFLICT', async () => {
    (
      prisma.jobDescription.findUnique as unknown as jest.Mock
    ).mockResolvedValue(mockJd);
    (prisma.apply.findFirst as unknown as jest.Mock).mockResolvedValue(
      mockApply
    );

    await expect(createApplication(userId, jdId)).rejects.toThrow(DomainError);
    await expect(createApplication(userId, jdId)).rejects.toMatchObject({
      code: 'CONFLICT',
    });
  });
});

describe('withdrawApplication', () => {
  it('정상 철회 — status: withdrawn으로 업데이트', async () => {
    (prisma.apply.findUnique as unknown as jest.Mock).mockResolvedValue(
      mockApply
    );
    (prisma.apply.update as unknown as jest.Mock).mockResolvedValue({
      ...mockApply,
      status: 'withdrawn',
    });

    const result = await withdrawApplication(userId, applyId);

    expect(result).toMatchObject({ status: 'withdrawn' });
    expect(prisma.apply.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'withdrawn' } })
    );
  });

  it('소유권 불일치 → DomainError FORBIDDEN', async () => {
    (prisma.apply.findUnique as unknown as jest.Mock).mockResolvedValue({
      ...mockApply,
      userId: 'other-user',
    });

    await expect(withdrawApplication(userId, applyId)).rejects.toThrow(
      DomainError
    );
    await expect(withdrawApplication(userId, applyId)).rejects.toMatchObject({
      code: 'FORBIDDEN',
    });
  });

  it('status=accepted → 철회 불가, DomainError CONFLICT', async () => {
    (prisma.apply.findUnique as unknown as jest.Mock).mockResolvedValue({
      ...mockApply,
      status: 'accepted',
    });

    await expect(withdrawApplication(userId, applyId)).rejects.toThrow(
      DomainError
    );
    await expect(withdrawApplication(userId, applyId)).rejects.toMatchObject({
      code: 'CONFLICT',
    });
  });
});

describe('getUserApplications', () => {
  it('userId로 지원 목록 반환 (createdAt desc)', async () => {
    (prisma.apply.findMany as unknown as jest.Mock).mockResolvedValue([
      mockApply,
    ]);

    const result = await getUserApplications(userId);

    expect(result).toEqual([mockApply]);
    expect(prisma.apply.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
    );
  });
});

describe('getApplicationsForJd', () => {
  it('jdId로 지원 목록 반환 (후보자 프로필 포함)', async () => {
    const applyWithProfile = {
      ...mockApply,
      user: {
        id: userId,
        profilePublic: { firstName: '김' },
        profileSkills: [],
      },
    };
    (prisma.apply.findMany as unknown as jest.Mock).mockResolvedValue([
      applyWithProfile,
    ]);

    const result = await getApplicationsForJd(jdId);

    expect(result).toEqual([applyWithProfile]);
    expect(prisma.apply.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { jdId } })
    );
  });
});

describe('getApplicantStats', () => {
  it('jdId에 대한 상태별 카운트 반환', async () => {
    const stats = [
      { status: 'applied', _count: { _all: 5 } },
      { status: 'accepted', _count: { _all: 2 } },
    ];
    (prisma.apply.groupBy as unknown as jest.Mock).mockResolvedValue(stats);

    const result = await getApplicantStats(jdId);

    expect(result).toEqual(stats);
    expect(prisma.apply.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({ by: ['status'], where: { jdId } })
    );
  });
});
