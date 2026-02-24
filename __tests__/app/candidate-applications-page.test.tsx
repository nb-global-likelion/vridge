import { screen } from '@testing-library/react';
import MyApplicationsPage from '@/app/(dashboard)/candidate/applications/page';
import { requireUser } from '@/backend/infrastructure/auth-utils';
import { getMyApplications } from '@/backend/actions/applications';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('@/backend/infrastructure/auth-utils', () => ({
  requireUser: jest.fn(),
  getCurrentUser: jest.fn(),
  requireRole: jest.fn(),
}));
jest.mock('@/backend/actions/applications', () => ({
  getMyApplications: jest.fn(),
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

const mockRequireUser = requireUser as unknown as jest.Mock;
const mockGetMyApplications = getMyApplications as unknown as jest.Mock;

describe('MyApplicationsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireUser.mockResolvedValue({
      userId: 'candidate-1',
      role: 'candidate',
      email: 'candidate@vridge.net',
      orgId: null,
    });
  });

  it('요약 통계와 지원 목록을 렌더링한다', async () => {
    mockGetMyApplications.mockResolvedValue({
      success: true,
      data: [
        {
          id: 'apply-1',
          jdId: 'jd-1',
          status: 'applied',
          createdAt: new Date('2026-02-01T00:00:00.000Z'),
          jd: {
            id: 'jd-1',
            title: 'Product Designer',
            employmentType: 'full_time',
            workArrangement: 'onsite',
            org: { name: 'Flowbit' },
            job: {
              displayNameEn: 'Designer',
              family: { displayNameEn: 'Design' },
            },
            skills: [],
          },
        },
        {
          id: 'apply-2',
          jdId: 'jd-2',
          status: 'accepted',
          createdAt: new Date('2026-02-02T00:00:00.000Z'),
          jd: {
            id: 'jd-2',
            title: 'Backend Developer',
            employmentType: 'full_time',
            workArrangement: 'remote',
            org: { name: 'PayNest' },
            job: {
              displayNameEn: 'Backend',
              family: { displayNameEn: 'Develop' },
            },
            skills: [],
          },
        },
      ],
    });

    const ui = await MyApplicationsPage();
    renderWithI18n(ui);

    expect(
      screen.getByRole('heading', { name: 'My Jobs', level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText('Product Designer')).toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
  });

  it('빈 목록일 때 jobs.empty 메시지를 렌더링한다', async () => {
    mockGetMyApplications.mockResolvedValue({
      success: true,
      data: [],
    });

    const ui = await MyApplicationsPage();
    renderWithI18n(ui);

    expect(screen.getByText('No job postings found.')).toBeInTheDocument();
  });

  it('액션 에러가 발생하면 에러 메시지를 렌더링한다', async () => {
    mockGetMyApplications.mockResolvedValue({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound',
      errorMessage: '지원 내역을 찾을 수 없습니다.',
    });

    const ui = await MyApplicationsPage();
    renderWithI18n(ui);

    expect(
      screen.getByText('지원 내역을 찾을 수 없습니다.')
    ).toBeInTheDocument();
  });

  it('이 라우트에서는 Apply Now CTA를 렌더링하지 않는다', async () => {
    mockGetMyApplications.mockResolvedValue({
      success: true,
      data: [
        {
          id: 'apply-1',
          jdId: 'jd-1',
          status: 'applied',
          createdAt: new Date('2026-02-01T00:00:00.000Z'),
          jd: {
            id: 'jd-1',
            title: 'Product Designer',
            employmentType: 'full_time',
            workArrangement: 'onsite',
            org: { name: 'Flowbit' },
            job: {
              displayNameEn: 'Designer',
              family: { displayNameEn: 'Design' },
            },
            skills: [],
          },
        },
      ],
    });

    const ui = await MyApplicationsPage();
    renderWithI18n(ui);

    expect(screen.queryByText('Apply Now')).not.toBeInTheDocument();
  });

  it('route-local 헤딩/카드 스타일을 적용한다', async () => {
    mockGetMyApplications.mockResolvedValue({
      success: true,
      data: [],
    });

    const ui = await MyApplicationsPage();
    renderWithI18n(ui);

    const jobsHeading = screen.getByRole('heading', {
      name: 'My Jobs',
      level: 1,
    });
    expect(jobsHeading).toHaveClass('text-h1');

    const listHeading = screen.getByRole('heading', {
      name: 'List',
      level: 2,
    });
    expect(listHeading).toHaveClass('text-h1');

    const appliedCard = screen.getByText('Applied').parentElement;
    const inProgressCard = screen.getByText('In progress').parentElement;

    expect(appliedCard).toHaveClass('rounded-[20px]');
    expect(appliedCard).toHaveClass('bg-bg');
    expect(inProgressCard).toHaveClass('rounded-[20px]');
    expect(inProgressCard).toHaveClass('bg-bg');
  });
});
