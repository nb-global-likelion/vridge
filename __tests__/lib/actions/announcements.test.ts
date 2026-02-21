import {
  getAnnouncements,
  getAnnouncementById,
  getAnnouncementNeighbors,
} from '@/backend/actions/announcements';
import { DomainError } from '@/backend/domain/errors';
import * as announcementsUC from '@/backend/use-cases/announcements';

jest.mock('@/backend/use-cases/announcements', () => ({
  getAnnouncements: jest.fn(),
  getAnnouncementById: jest.fn(),
  getAnnouncementNeighbors: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

describe('getAnnouncements', () => {
  it('유효한 입력 → use-case 호출 후 데이터 반환', async () => {
    const mockResult = {
      items: [{ id: 'ann-1', title: '공지' }],
      total: 1,
      page: 1,
      pageSize: 20,
    };
    (
      announcementsUC.getAnnouncements as unknown as jest.Mock
    ).mockResolvedValue(mockResult);

    const result = await getAnnouncements({ page: 1, pageSize: 20 });

    expect(result).toEqual({ success: true, data: mockResult });
    expect(announcementsUC.getAnnouncements).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
    });
  });

  it('유효하지 않은 입력 (Zod 오류) → 코드/키 에러 반환', async () => {
    const result = await getAnnouncements({ page: -1, pageSize: 100 });

    expect(result).toEqual(
      expect.objectContaining({
        errorCode: 'FILTER_INVALID',
        errorKey: 'error.filterInvalid',
        errorMessage: expect.any(String),
      })
    );
    expect(announcementsUC.getAnnouncements).not.toHaveBeenCalled();
  });

  it('입력 없음 (빈 객체) → 기본값으로 use-case 호출', async () => {
    (
      announcementsUC.getAnnouncements as unknown as jest.Mock
    ).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });

    const result = await getAnnouncements({});

    expect(result).toEqual(expect.objectContaining({ success: true }));
    expect(announcementsUC.getAnnouncements).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, pageSize: 20 })
    );
  });
});

describe('getAnnouncementById', () => {
  it('공지사항 조회 성공 → { success: true, data }', async () => {
    const mockAnn = { id: 'ann-1', title: '공지' };
    (
      announcementsUC.getAnnouncementById as unknown as jest.Mock
    ).mockResolvedValue(mockAnn);

    const result = await getAnnouncementById('ann-1');

    expect(result).toEqual({ success: true, data: mockAnn });
    expect(announcementsUC.getAnnouncementById).toHaveBeenCalledWith('ann-1');
  });

  it('DomainError NOT_FOUND → 코드/키/메시지 에러 반환', async () => {
    const domainErr = new DomainError(
      'NOT_FOUND',
      '공지사항을(를) 찾을 수 없습니다',
      'error.notFound.announcement'
    );
    (
      announcementsUC.getAnnouncementById as unknown as jest.Mock
    ).mockRejectedValue(domainErr);

    const result = await getAnnouncementById('nonexistent');

    expect(result).toEqual({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound.announcement',
      errorMessage: '공지사항을(를) 찾을 수 없습니다',
    });
  });
});

describe('getAnnouncementNeighbors', () => {
  it('다음/이전 공지 조회 성공 → { success: true, data }', async () => {
    const neighbors = {
      next: { id: 'ann-2', title: '다음 공지', createdAt: new Date() },
      before: { id: 'ann-0', title: '이전 공지', createdAt: new Date() },
    };
    (
      announcementsUC.getAnnouncementNeighbors as unknown as jest.Mock
    ).mockResolvedValue(neighbors);

    const result = await getAnnouncementNeighbors('ann-1');

    expect(result).toEqual({ success: true, data: neighbors });
    expect(announcementsUC.getAnnouncementNeighbors).toHaveBeenCalledWith(
      'ann-1'
    );
  });

  it('DomainError → 코드/키/메시지 에러 반환', async () => {
    (
      announcementsUC.getAnnouncementNeighbors as unknown as jest.Mock
    ).mockRejectedValue(
      new DomainError(
        'NOT_FOUND',
        '공지사항을 찾을 수 없습니다',
        'error.notFound.announcement'
      )
    );

    const result = await getAnnouncementNeighbors('ann-unknown');

    expect(result).toEqual({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound.announcement',
      errorMessage: '공지사항을 찾을 수 없습니다',
    });
  });
});
