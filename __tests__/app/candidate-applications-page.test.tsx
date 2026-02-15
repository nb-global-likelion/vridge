import { screen } from '@testing-library/react';
import MyApplicationsPage from '@/app/(dashboard)/candidate/applications/page';
import { requireUser } from '@/lib/infrastructure/auth-utils';
import { getMyApplications } from '@/lib/actions/applications';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('@/lib/infrastructure/auth-utils', () => ({
  requireUser: jest.fn(),
  getCurrentUser: jest.fn(),
  requireRole: jest.fn(),
}));
jest.mock('@/lib/actions/applications', () => ({
  getMyApplications: jest.fn(),
}));
jest.mock('@/lib/i18n/server', () => {
  const { enMessages } = jest.requireActual('@/lib/i18n/messages/en');
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

    expect(screen.getByText('My Jobs')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText('Product Designer')).toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
  });
});
