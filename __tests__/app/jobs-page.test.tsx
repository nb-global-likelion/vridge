import { screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import JobsPage from '@/app/jobs/page';
import { getJobDescriptions } from '@/backend/actions/jd-queries';
import { getJobFamilies } from '@/backend/actions/catalog';
import { getMyApplications } from '@/backend/actions/applications';
import { getCurrentUser } from '@/backend/infrastructure/auth-utils';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('@/backend/actions/jd-queries', () => ({
  getJobDescriptions: jest.fn(),
}));

jest.mock('@/backend/actions/catalog', () => ({
  getJobFamilies: jest.fn(),
}));

jest.mock('@/backend/actions/applications', () => ({
  getMyApplications: jest.fn(),
}));

jest.mock('@/backend/infrastructure/auth-utils', () => ({
  requireUser: jest.fn(),
  getCurrentUser: jest.fn(),
  requireRole: jest.fn(),
}));

jest.mock('@/frontend/features/job-browse/ui/job-search-form', () => ({
  JobSearchForm: ({ initialSearch }: { initialSearch?: string }) => (
    <div data-testid="job-search-form">{initialSearch ?? ''}</div>
  ),
}));

jest.mock('@/frontend/features/job-browse/ui/job-category-tabs', () => ({
  JobCategoryTabs: () => <div data-testid="job-category-tabs">tabs</div>,
}));

jest.mock('@/frontend/features/job-browse/ui/job-sort-control', () => ({
  JobSortControl: () => <div data-testid="job-sort-control">sort</div>,
}));

jest.mock('@/frontend/entities/job/ui/posting-list-item', () => ({
  PostingListItem: ({ title, cta }: { title: string; cta?: ReactNode }) => (
    <div data-testid="posting-list-item">
      <span>{title}</span>
      {cta}
    </div>
  ),
}));

jest.mock('@/frontend/components/ui/numbered-pagination', () => ({
  NumberedPagination: ({
    currentPage,
    totalPages,
  }: {
    currentPage: number;
    totalPages: number;
  }) => (
    <div data-testid="jobs-pagination">{`${currentPage}/${totalPages}`}</div>
  ),
}));

jest.mock('@/app/jobs/_jobs-list-apply-cta', () => ({
  JobsListApplyCta: ({
    status,
    isApplied,
  }: {
    status: 'recruiting' | 'done';
    isApplied: boolean;
  }) => (
    <button type="button">
      {status === 'done' ? 'Apply Now' : isApplied ? 'Applied ✓' : 'Apply Now'}
    </button>
  ),
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

const mockGetJobDescriptions = getJobDescriptions as unknown as jest.Mock;
const mockGetJobFamilies = getJobFamilies as unknown as jest.Mock;
const mockGetMyApplications = getMyApplications as unknown as jest.Mock;
const mockGetCurrentUser = getCurrentUser as unknown as jest.Mock;

const baseItems = [
  {
    id: 'jd-1',
    title: 'Product Designer',
    status: 'recruiting' as const,
    employmentType: 'full_time',
    workArrangement: 'onsite',
    minYearsExperience: 4,
    minEducation: 'higher_bachelor',
    skills: [],
    createdAt: new Date('2026-02-01T00:00:00.000Z'),
    org: { name: 'Flowbit' },
    job: {
      displayNameEn: 'Designer',
      displayNameKo: null,
      displayNameVi: null,
      family: {
        displayNameEn: 'Design',
        displayNameKo: null,
        displayNameVi: null,
      },
    },
  },
  {
    id: 'jd-2',
    title: 'Content Marketer',
    status: 'done' as const,
    employmentType: 'intern',
    workArrangement: 'onsite',
    minYearsExperience: null,
    minEducation: 'higher_bachelor',
    skills: [],
    createdAt: new Date('2026-02-02T00:00:00.000Z'),
    org: { name: 'Wanderly' },
    job: {
      displayNameEn: 'Marketer',
      displayNameKo: null,
      displayNameVi: null,
      family: {
        displayNameEn: 'Marketing',
        displayNameKo: null,
        displayNameVi: null,
      },
    },
  },
];

describe('JobsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetJobDescriptions.mockResolvedValue({
      success: true,
      data: {
        items: baseItems,
        total: baseItems.length,
        page: 1,
        pageSize: 20,
      },
    });

    mockGetJobFamilies.mockResolvedValue({
      success: true,
      data: [
        {
          id: 'design',
          displayNameEn: 'Design',
          displayNameKo: '디자인',
          displayNameVi: 'Thiết kế',
        },
      ],
    });

    mockGetCurrentUser.mockResolvedValue(null);
    mockGetMyApplications.mockResolvedValue({ success: true, data: [] });
  });

  it('jobs 목록과 CTA를 렌더링한다', async () => {
    const ui = await JobsPage({ searchParams: Promise.resolve({}) });
    renderWithI18n(ui);

    expect(screen.getByTestId('job-search-form')).toBeInTheDocument();
    expect(screen.getByTestId('job-category-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('job-sort-control')).toBeInTheDocument();
    expect(screen.getByText('Product Designer')).toBeInTheDocument();
    expect(screen.getByText('Content Marketer')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /apply now|applied/i }).length
    ).toBe(2);
  });

  it('후보자 로그인 상태면 지원한 공고는 Applied 상태로 렌더링한다', async () => {
    mockGetCurrentUser.mockResolvedValue({
      userId: 'candidate-1',
      email: 'candidate@vridge.net',
      role: 'candidate',
      orgId: null,
    });
    mockGetMyApplications.mockResolvedValue({
      success: true,
      data: [{ jdId: 'jd-1' }],
    });

    const ui = await JobsPage({ searchParams: Promise.resolve({}) });
    renderWithI18n(ui);

    expect(
      screen.getByRole('button', { name: /Applied/i })
    ).toBeInTheDocument();
  });

  it('액션 에러 시 translated 에러 텍스트를 렌더링한다', async () => {
    mockGetJobDescriptions.mockResolvedValue({
      errorCode: 'UNKNOWN',
      errorKey: 'error.unknown',
      errorMessage: '목록을 불러오지 못했습니다.',
    });

    const ui = await JobsPage({ searchParams: Promise.resolve({}) });
    renderWithI18n(ui);

    expect(screen.getByText('목록을 불러오지 못했습니다.')).toBeInTheDocument();
  });

  it('빈 목록일 때 jobs.empty 메시지를 렌더링한다', async () => {
    mockGetJobDescriptions.mockResolvedValue({
      success: true,
      data: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 20,
      },
    });

    const ui = await JobsPage({ searchParams: Promise.resolve({}) });
    renderWithI18n(ui);

    expect(screen.getByText('No job postings found.')).toBeInTheDocument();
  });

  it('route-level 레이아웃 클래스를 적용한다', async () => {
    const ui = await JobsPage({ searchParams: Promise.resolve({}) });
    const { container } = renderWithI18n(ui);

    const searchForm = screen.getByTestId('job-search-form');
    expect(searchForm.parentElement).toHaveClass('max-w-[800px]');
    expect(searchForm.parentElement?.parentElement).toHaveClass(
      'max-w-[1200px]'
    );

    const tabs = screen.getByTestId('job-category-tabs');
    expect(tabs.parentElement?.parentElement).toHaveClass(
      'grid-cols-[1fr_auto_1fr]'
    );

    const firstPosting = screen.getAllByTestId('posting-list-item')[0];
    expect(firstPosting.parentElement).toHaveClass('gap-[20px]');
    expect(
      container.querySelector('[data-testid="jobs-pagination"]')
    ).toBeInTheDocument();
  });
});
