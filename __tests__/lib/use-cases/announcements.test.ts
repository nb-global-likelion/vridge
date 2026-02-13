import {
  getAnnouncements,
  getAnnouncementById,
} from '@/lib/use-cases/announcements';
import { DomainError } from '@/lib/domain/errors';
import { prisma } from '@/lib/infrastructure/db';

jest.mock('@/lib/infrastructure/db', () => ({
  prisma: {
    announcement: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

beforeEach(() => jest.clearAllMocks());

const mockAnnouncement = {
  id: 'ann-1',
  title: '서비스 점검 안내',
  content: '점검 내용입니다.',
  isPinned: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

describe('getAnnouncements', () => {
  beforeEach(() => {
    (prisma.announcement.findMany as unknown as jest.Mock).mockResolvedValue([
      mockAnnouncement,
    ]);
    (prisma.announcement.count as unknown as jest.Mock).mockResolvedValue(1);
  });

  it('기본 페이지네이션 — 전체 목록 반환', async () => {
    const result = await getAnnouncements({ page: 1, pageSize: 20 });

    expect(result).toEqual({
      items: [mockAnnouncement],
      total: 1,
      page: 1,
      pageSize: 20,
    });
    expect(prisma.announcement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      })
    );
  });

  it('page 2 — skip: pageSize', async () => {
    await getAnnouncements({ page: 2, pageSize: 10 });

    expect(prisma.announcement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10 })
    );
  });

  it('{ items, total, page, pageSize } 형태 반환', async () => {
    (prisma.announcement.count as unknown as jest.Mock).mockResolvedValue(42);

    const result = await getAnnouncements({ page: 3, pageSize: 5 });

    expect(result.total).toBe(42);
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(5);
  });
});

describe('getAnnouncementById', () => {
  it('공지사항 반환', async () => {
    (prisma.announcement.findUnique as unknown as jest.Mock).mockResolvedValue(
      mockAnnouncement
    );

    const result = await getAnnouncementById('ann-1');

    expect(result).toEqual(mockAnnouncement);
    expect(prisma.announcement.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'ann-1' } })
    );
  });

  it('공지사항 없음 → DomainError throw', async () => {
    (prisma.announcement.findUnique as unknown as jest.Mock).mockResolvedValue(
      null
    );

    await expect(getAnnouncementById('nonexistent')).rejects.toThrow(
      DomainError
    );
  });
});
