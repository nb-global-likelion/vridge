import {
  getAnnouncements,
  getAnnouncementById,
  getAnnouncementNeighbors,
} from '@/backend/use-cases/announcements';
import { DomainError } from '@/backend/domain/errors';
import { prisma } from '@/backend/infrastructure/db';

jest.mock('@/backend/infrastructure/db', () => ({
  prisma: {
    announcement: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
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

describe('getAnnouncementNeighbors', () => {
  it('게시판 순서에서 다음/이전 공지 반환', async () => {
    (prisma.announcement.findUnique as unknown as jest.Mock).mockResolvedValue(
      mockAnnouncement
    );
    (prisma.announcement.findMany as unknown as jest.Mock).mockResolvedValue([
      { id: 'ann-3', title: '세 번째', isPinned: true, createdAt: new Date() },
      { id: 'ann-1', title: '현재', isPinned: true, createdAt: new Date() },
      {
        id: 'ann-2',
        title: '두 번째',
        isPinned: false,
        createdAt: new Date(),
      },
    ]);

    const result = await getAnnouncementNeighbors('ann-1');

    expect(result).toEqual({
      next: {
        id: 'ann-2',
        title: '두 번째',
        isPinned: false,
        createdAt: expect.any(Date),
      },
      before: {
        id: 'ann-3',
        title: '세 번째',
        isPinned: true,
        createdAt: expect.any(Date),
      },
    });
    expect(prisma.announcement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
      })
    );
  });

  it('공지사항 없음 → DomainError throw', async () => {
    (prisma.announcement.findUnique as unknown as jest.Mock).mockResolvedValue(
      null
    );

    await expect(getAnnouncementNeighbors('nonexistent')).rejects.toThrow(
      DomainError
    );
  });
});
