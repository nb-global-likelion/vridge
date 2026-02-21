import { screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import AnnouncementDetailPage from '@/app/announcements/[id]/page';
import {
  getAnnouncementById,
  getAnnouncementNeighbors,
} from '@/backend/actions/announcements';
import { notFound } from 'next/navigation';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/backend/actions/announcements', () => ({
  getAnnouncementById: jest.fn(),
  getAnnouncementNeighbors: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));
jest.mock('@/shared/i18n/server', () => {
  const { enMessages } = jest.requireActual('@/shared/i18n/messages/en');
  return {
    getServerI18n: jest.fn(async () => ({
      locale: 'en',
      messages: enMessages,
      t: (key: string) => enMessages[key] ?? key,
    })),
  };
});

const mockGetAnnouncementById = getAnnouncementById as unknown as jest.Mock;
const mockGetAnnouncementNeighbors =
  getAnnouncementNeighbors as unknown as jest.Mock;
const mockNotFound = notFound as unknown as jest.Mock;
const ANNOUNCEMENT_MARKDOWN_FIXTURE = [
  '## About Us',
  '',
  'Announcement body paragraph.',
  '',
  '## Responsibilities',
  '',
  '- Publish release notes',
  '- Share operational updates',
].join('\n');

describe('AnnouncementDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('상세/핀/Next-Before 영역을 렌더링한다', async () => {
    mockGetAnnouncementById.mockResolvedValue({
      success: true,
      data: {
        id: 'ann-1',
        title: 'About Vridge',
        content: ANNOUNCEMENT_MARKDOWN_FIXTURE,
        isPinned: true,
        createdAt: new Date('2026-02-06T00:00:00.000Z'),
        updatedAt: new Date('2026-02-06T00:00:00.000Z'),
      },
    });
    mockGetAnnouncementNeighbors.mockResolvedValue({
      success: true,
      data: {
        next: {
          id: 'ann-2',
          title: '다음 공지',
          isPinned: false,
          createdAt: new Date('2026-03-18T00:00:00.000Z'),
        },
        before: {
          id: 'ann-0',
          title: '이전 공지',
          isPinned: false,
          createdAt: new Date('2026-02-14T00:00:00.000Z'),
        },
      },
    });

    const ui = await AnnouncementDetailPage({
      params: Promise.resolve({ id: 'ann-1' }),
    });
    renderWithI18n(ui);

    const heading = screen.getByRole('heading', {
      name: 'About Vridge',
      level: 1,
    });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-[30px]', 'leading-[1.5]');
    expect(screen.getByText('(Pinned)')).toBeInTheDocument();

    const markdownText = screen.getByText(/## About Us/);
    const markdownWrapper = markdownText.closest('div')?.parentElement;
    expect(markdownWrapper).toHaveClass(
      'text-[18px]',
      '[&_h2]:text-[22px]',
      '[&_ul]:list-disc',
      '[&_ul]:pl-[27px]',
      '[&_li]:mb-[4px]'
    );

    const contentCard = markdownWrapper?.parentElement;
    expect(contentCard).toHaveClass(
      'bg-[#fbfbfb]',
      'rounded-[20px]',
      'px-[20px]',
      'pt-[20px]',
      'pb-[40px]'
    );

    expect(screen.getByRole('link', { name: '다음 공지' })).toHaveAttribute(
      'href',
      '/announcements/ann-2'
    );
    expect(screen.getByRole('link', { name: '이전 공지' })).toHaveAttribute(
      'href',
      '/announcements/ann-0'
    );
    expect(screen.getByText('Next').parentElement).toHaveClass(
      'grid-cols-[94px_1fr_193px]',
      'gap-[30px]',
      'text-[#4c4c4c]'
    );
    expect(
      screen.getByRole('link', { name: /back to announcement list/i })
    ).toHaveAttribute('href', '/announcements');
  });

  it('NOT_FOUND 에러 코드면 notFound를 호출한다', async () => {
    mockGetAnnouncementById.mockResolvedValue({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound.announcement',
      errorMessage: '공지사항을 찾을 수 없습니다',
    });
    mockGetAnnouncementNeighbors.mockResolvedValue({
      success: true,
      data: { next: null, before: null },
    });
    mockNotFound.mockImplementation(() => {
      throw new Error('NEXT_HTTP_ERROR_FALLBACK;404');
    });

    await expect(
      AnnouncementDetailPage({ params: Promise.resolve({ id: 'missing' }) })
    ).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
    expect(mockNotFound).toHaveBeenCalled();
  });

  it('NOT_FOUND가 아닌 에러는 에러 바운더리로 전파한다', async () => {
    mockGetAnnouncementById.mockResolvedValue({
      errorCode: 'CONFLICT',
      errorKey: 'error.conflict.unknown',
      errorMessage: '일시적인 오류입니다',
    });
    mockGetAnnouncementNeighbors.mockResolvedValue({
      success: true,
      data: { next: null, before: null },
    });

    await expect(
      AnnouncementDetailPage({ params: Promise.resolve({ id: 'ann-1' }) })
    ).rejects.toThrow('일시적인 오류입니다');
    expect(mockNotFound).not.toHaveBeenCalled();
  });
});
