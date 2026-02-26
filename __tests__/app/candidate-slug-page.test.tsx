import { screen } from '@testing-library/react';
import CandidateSlugPage from '@/app/candidate/[slug]/page';
import { getProfileBySlug } from '@/backend/actions/profile';
import { getCurrentUser } from '@/backend/infrastructure/auth-utils';
import { getMyApplications } from '@/backend/actions/applications';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('@/backend/actions/profile', () => ({
  getProfileBySlug: jest.fn(),
}));
jest.mock('@/backend/infrastructure/auth-utils', () => ({
  getCurrentUser: jest.fn(),
  requireUser: jest.fn(),
  requireRole: jest.fn(),
}));
jest.mock('@/backend/actions/applications', () => ({
  getMyApplications: jest.fn(),
}));
jest.mock('@/shared/i18n/server', () => {
  const { enMessages } = jest.requireActual('@/shared/i18n/messages/en');
  const { koMessages } = jest.requireActual('@/shared/i18n/messages/ko');
  const messagesByLocale = {
    en: enMessages,
    ko: koMessages,
  } as const;
  let locale: keyof typeof messagesByLocale = 'en';

  return {
    __setLocaleForTest: (nextLocale: keyof typeof messagesByLocale) => {
      locale = nextLocale;
    },
    getServerI18n: jest.fn(async () => ({
      locale,
      messages: messagesByLocale[locale],
      t: (key: string) => messagesByLocale[locale][key] ?? key,
    })),
  };
});

const mockGetProfileBySlug = getProfileBySlug as unknown as jest.Mock;
const mockGetCurrentUser = getCurrentUser as unknown as jest.Mock;
const mockGetMyApplications = getMyApplications as unknown as jest.Mock;
const mockI18nServer = jest.requireMock('@/shared/i18n/server') as {
  __setLocaleForTest: (locale: 'en' | 'ko') => void;
};

const profileData = {
  id: 'user-1',
  authUser: { email: 'lion@vridge.net' },
  profilePublic: {
    firstName: 'Lion',
    lastName: 'Park',
    dateOfBirth: new Date('2000-02-10T00:00:00.000Z'),
    location: 'Ho Chi Minh City',
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
    mockI18nServer.__setLocaleForTest('en');
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

  it('ko 로케일에서 공개 프로필 상태 문구를 현지화한다', async () => {
    mockI18nServer.__setLocaleForTest('ko');
    mockGetCurrentUser.mockResolvedValue(null);

    const ui = await CandidateSlugPage({
      params: Promise.resolve({ slug: 'lion-park' }),
    });
    renderWithI18n(ui, { locale: 'ko' });

    expect(screen.getByText('구직 중')).toBeInTheDocument();
    expect(screen.queryByText('Open to Work')).not.toBeInTheDocument();
  });
});
