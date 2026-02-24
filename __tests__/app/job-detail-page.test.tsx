import { screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import JobDetailPage from '@/app/jobs/[id]/page';
import { headers } from 'next/headers';
import { auth } from '@/backend/infrastructure/auth';
import { getJobDescriptionById } from '@/backend/actions/jd-queries';
import { getMyApplications } from '@/backend/actions/applications';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/backend/infrastructure/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock('@/backend/actions/jd-queries', () => ({
  getJobDescriptionById: jest.fn(),
}));

jest.mock('@/backend/actions/applications', () => ({
  getMyApplications: jest.fn(),
}));

jest.mock('@/shared/i18n/catalog', () => ({
  getLocalizedCatalogName: jest.fn(() => 'UI/UX Designer'),
}));

jest.mock('@/frontend/lib/presentation', () => ({
  getWorkArrangementLabel: jest.fn(() => 'Remote'),
}));

jest.mock('@/shared/i18n/action-error', () => ({
  getActionErrorMessage: jest.fn(
    (error: { errorMessage?: string }) =>
      error.errorMessage ?? '알 수 없는 오류가 발생했습니다.'
  ),
}));

jest.mock('@/frontend/entities/job/ui/posting-title', () => ({
  PostingTitle: ({ backHref, title }: { backHref?: string; title: string }) => (
    <div data-testid="posting-title" data-back-href={backHref ?? ''}>
      {title}
    </div>
  ),
}));

jest.mock('@/frontend/entities/job/ui/summary-card', () => ({
  SummaryCard: ({
    cta,
    secondaryAction,
  }: {
    cta?: ReactNode;
    secondaryAction?: ReactNode;
  }) => (
    <div data-testid="summary-card">
      <div data-testid="summary-cta">{cta}</div>
      <div data-testid="summary-secondary">{secondaryAction}</div>
    </div>
  ),
}));

jest.mock('@/frontend/features/apply/ui/apply-button', () => ({
  ApplyButton: ({ allowWithdraw }: { allowWithdraw?: boolean }) => (
    <div
      data-testid="apply-button"
      data-allow-withdraw={String(allowWithdraw ?? true)}
    />
  ),
}));

jest.mock('@/app/jobs/[id]/_login-to-apply-cta', () => ({
  LoginToApplyCta: () => <div data-testid="login-to-apply-cta">Login CTA</div>,
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

const mockHeaders = headers as unknown as jest.Mock;
const mockGetSession = auth.api.getSession as unknown as jest.Mock;
const mockGetJobDescriptionById = getJobDescriptionById as unknown as jest.Mock;
const mockGetMyApplications = getMyApplications as unknown as jest.Mock;
const JOB_MARKDOWN_FIXTURE = [
  '## About Us',
  '',
  'Vridge builds practical ATS workflows.',
  '',
  '## Responsibilities',
  '',
  '- Build and deliver roadmap items.',
  '- Collaborate with product and design.',
].join('\n');

describe('JobDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHeaders.mockResolvedValue(new Headers());
    mockGetSession.mockResolvedValue({
      user: { id: 'candidate-1' },
    });
    mockGetJobDescriptionById.mockResolvedValue({
      success: true,
      data: {
        id: 'jd-1',
        title: '[Likelion] UXUI Designer / Full-time / 3+ Years',
        descriptionMarkdown: JOB_MARKDOWN_FIXTURE,
        createdAt: new Date('2026-02-16T00:00:00.000Z'),
        workArrangement: 'remote',
        minYearsExperience: 3,
        minEducation: 'higher_bachelor',
        employmentType: 'full_time',
        skills: [{ skill: { displayNameEn: 'Figma' } }],
        org: { name: 'Likelion' },
        job: {
          displayNameEn: 'UI/UX Designer',
          displayNameKo: null,
          displayNameVi: null,
        },
      },
    });
    mockGetMyApplications.mockResolvedValue({
      success: true,
      data: [{ id: 'apply-1', jdId: 'jd-1' }],
    });
  });

  it('상세 페이지에서 withdraw를 비활성화한 ApplyButton과 share/back 액션을 주입한다', async () => {
    const ui = await JobDetailPage({
      params: Promise.resolve({ id: 'jd-1' }),
    });
    renderWithI18n(ui);

    expect(screen.getByTestId('posting-title')).toHaveAttribute(
      'data-back-href',
      '/jobs'
    );
    expect(screen.getByTestId('apply-button')).toHaveAttribute(
      'data-allow-withdraw',
      'false'
    );

    const markdownText = screen.getByText(/## About Us/);
    const markdownWrapper = markdownText.closest('div')?.parentElement;
    expect(markdownWrapper).toHaveClass(
      'text-body-1',
      '[&_h2]:text-h2',
      '[&_h2]:text-text-title-2',
      '[&_ul]:list-disc',
      '[&_ul]:pl-[27px]',
      '[&_li]:mb-[4px]'
    );
    const markdownCard = markdownWrapper?.parentElement;
    expect(markdownCard).toHaveClass(
      'bg-bg',
      'rounded-[20px]',
      'px-[40px]',
      'pt-[20px]',
      'pb-[40px]'
    );

    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
    expect(screen.queryByTestId('login-to-apply-cta')).toBeNull();
  });

  it('비로그인 상태에서는 로그인 CTA를 렌더링한다', async () => {
    mockGetSession.mockResolvedValue(null);

    const ui = await JobDetailPage({
      params: Promise.resolve({ id: 'jd-1' }),
    });
    renderWithI18n(ui);

    expect(screen.getByTestId('login-to-apply-cta')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
    expect(mockGetMyApplications).not.toHaveBeenCalled();
  });

  it('채용공고 조회 실패 시 에러 메시지를 렌더링한다', async () => {
    mockGetJobDescriptionById.mockResolvedValue({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound.jobDescription',
      errorMessage: '채용공고를 찾을 수 없습니다.',
    });

    const ui = await JobDetailPage({
      params: Promise.resolve({ id: 'missing' }),
    });
    renderWithI18n(ui);

    expect(
      screen.getByText('채용공고를 찾을 수 없습니다.')
    ).toBeInTheDocument();
  });
});
