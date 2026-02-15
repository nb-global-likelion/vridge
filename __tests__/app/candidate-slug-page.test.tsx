import { screen } from '@testing-library/react';
import CandidateSlugPage from '@/app/candidate/[slug]/page';
import { getProfileBySlug } from '@/lib/actions/profile';
import { getCurrentUser } from '@/lib/infrastructure/auth-utils';
import { getMyApplications } from '@/lib/actions/applications';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('@/lib/actions/profile', () => ({
  getProfileBySlug: jest.fn(),
}));
jest.mock('@/lib/infrastructure/auth-utils', () => ({
  getCurrentUser: jest.fn(),
  requireUser: jest.fn(),
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

const mockGetProfileBySlug = getProfileBySlug as unknown as jest.Mock;
const mockGetCurrentUser = getCurrentUser as unknown as jest.Mock;
const mockGetMyApplications = getMyApplications as unknown as jest.Mock;

const profileData = {
  id: 'user-1',
  authUser: { email: 'lion@vridge.net' },
  profilePublic: {
    firstName: 'Lion',
    lastName: 'Park',
    dateOfBirth: new Date('2000-02-10T00:00:00.000Z'),
    location: 'Ho Chi Minh City',
    headline: 'Product Designer',
    aboutMe: '소개',
    isOpenToWork: true,
    profileImageUrl: null,
    isPublic: true,
    publicSlug: 'lion-park',
  },
  profilePrivate: null,
  careers: [],
  educations: [],
  languages: [],
  urls: [],
  profileSkills: [],
  certifications: [],
};

describe('CandidateSlugPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProfileBySlug.mockResolvedValue({
      success: true,
      data: profileData,
    });
  });

  it('소유자일 때 My Jobs 통계를 보여준다', async () => {
    mockGetCurrentUser.mockResolvedValue({
      userId: 'user-1',
      email: 'lion@vridge.net',
      role: 'candidate',
      orgId: null,
    });
    mockGetMyApplications.mockResolvedValue({
      success: true,
      data: [
        { status: 'applied' },
        { status: 'accepted' },
        { status: 'applied' },
      ],
    });

    const ui = await CandidateSlugPage({
      params: Promise.resolve({ slug: 'lion-park' }),
    });
    renderWithI18n(ui);

    expect(screen.getByText('My Jobs')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
  });

  it('비소유자일 때 My Jobs 통계를 숨긴다', async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const ui = await CandidateSlugPage({
      params: Promise.resolve({ slug: 'lion-park' }),
    });
    renderWithI18n(ui);

    expect(screen.queryByText('My Jobs')).not.toBeInTheDocument();
    expect(mockGetMyApplications).not.toHaveBeenCalled();
  });
});
