import { screen } from '@testing-library/react';
import CandidateProfilePage from '@/app/(dashboard)/candidate/profile/page';
import { getMyProfile } from '@/backend/actions/profile';
import { requireUser } from '@/backend/infrastructure/auth-utils';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('@/backend/actions/profile', () => ({
  getMyProfile: jest.fn(),
}));
jest.mock('@/backend/infrastructure/auth-utils', () => ({
  requireUser: jest.fn(),
  getCurrentUser: jest.fn(),
  requireRole: jest.fn(),
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

const mockGetMyProfile = getMyProfile as unknown as jest.Mock;
const mockRequireUser = requireUser as unknown as jest.Mock;

const profileData = {
  id: 'user-1',
  authUser: { email: 'lion@vridge.net' },
  profilePublic: {
    firstName: 'Lion',
    lastName: 'Park',
    dateOfBirth: new Date('2000-02-10T00:00:00.000Z'),
    location: 'Ho Chi Minh City',
    headline: 'Product Designer',
    aboutMe: 'Designing intuitive products',
    isOpenToWork: true,
    profileImageUrl: null,
    isPublic: true,
    publicSlug: 'lion-park',
  },
  profilePrivate: {
    phoneNumber: '+84 1234 5678',
  },
  careers: [
    {
      id: 'career-1',
      companyName: 'Flowbit',
      positionTitle: 'UI Designer',
      employmentType: 'full_time',
      startDate: new Date('2022-01-01T00:00:00.000Z'),
      endDate: null,
      description: 'Led design system.',
      experienceLevel: 'SENIOR',
      sortOrder: 0,
      job: { displayNameEn: 'Designer' },
    },
  ],
  educations: [
    {
      id: 'edu-1',
      institutionName: 'Hanoi University',
      educationType: 'higher_bachelor',
      field: 'Industrial Design',
      graduationStatus: 'GRADUATED',
      startDate: new Date('2020-09-01T00:00:00.000Z'),
      endDate: new Date('2024-02-01T00:00:00.000Z'),
      sortOrder: 0,
    },
  ],
  languages: [
    {
      id: 'lang-1',
      language: 'English',
      proficiency: 'professional',
      testName: 'TOEFL',
      testScore: '100',
      sortOrder: 0,
    },
  ],
  urls: [
    {
      id: 'url-1',
      label: 'Portfolio',
      url: 'https://example.com',
      sortOrder: 0,
    },
  ],
  profileSkills: [{ skill: { displayNameEn: 'Figma' } }],
  certifications: [
    {
      id: 'cert-1',
      name: 'UX Design Excellence Award',
      date: new Date('2023-01-01T00:00:00.000Z'),
      description: 'Awarded for UX outcomes.',
      institutionName: 'Fintech Asia Conference',
      sortOrder: 0,
    },
  ],
};

describe('CandidateProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireUser.mockResolvedValue({
      userId: 'candidate-1',
      role: 'candidate',
      email: 'lion@vridge.net',
      orgId: null,
    });
  });

  it('내 프로필 페이지를 렌더링하고 Edit Profile CTA를 표시한다', async () => {
    mockGetMyProfile.mockResolvedValue({
      success: true,
      data: profileData,
    });

    const ui = await CandidateProfilePage();
    const { container } = renderWithI18n(ui);

    expect(screen.getByText('Basic Profile')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Certification')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Portfolio' })
    ).toBeInTheDocument();

    expect(screen.getByText('Lion Park')).toBeInTheDocument();
    expect(screen.getByText('lion@vridge.net')).toBeInTheDocument();
    expect(screen.getByText('+84 1234 5678')).toBeInTheDocument();
    expect(screen.getByText('Industrial Design')).toBeInTheDocument();
    expect(screen.getByText('Graduated')).toBeInTheDocument();
    expect(screen.getByText('Senior')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="chip"]')).toHaveLength(1);

    expect(screen.getByRole('link', { name: 'Edit Profile' })).toHaveAttribute(
      'href',
      '/candidate/profile/edit'
    );
  });

  it('액션 에러가 발생하면 에러 메시지를 렌더링한다', async () => {
    mockGetMyProfile.mockResolvedValue({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound',
      errorMessage: '프로필을 찾을 수 없습니다.',
    });

    const ui = await CandidateProfilePage();
    renderWithI18n(ui);

    expect(screen.getByText('프로필을 찾을 수 없습니다.')).toBeInTheDocument();
  });
});
