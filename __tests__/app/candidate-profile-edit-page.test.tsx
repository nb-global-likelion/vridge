import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import CandidateProfileEditPage from '@/app/(dashboard)/candidate/profile/edit/page';
import { getMyProfile } from '@/backend/actions/profile';
import { getJobFamilies } from '@/backend/actions/catalog';
import { requireUser } from '@/backend/infrastructure/auth-utils';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('@/backend/actions/profile', () => ({
  getMyProfile: jest.fn(),
}));
jest.mock('@/backend/actions/catalog', () => ({
  getJobFamilies: jest.fn(),
}));
jest.mock('@/backend/infrastructure/auth-utils', () => ({
  requireUser: jest.fn(),
  getCurrentUser: jest.fn(),
  requireRole: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ refresh: jest.fn() })),
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
const mockGetJobFamilies = getJobFamilies as unknown as jest.Mock;
const mockRequireUser = requireUser as unknown as jest.Mock;

const profileData = {
  id: 'user-1',
  authUser: { email: 'lion@vridge.net' },
  profilePublic: {
    firstName: 'Lion',
    lastName: 'Park',
    aboutMe: 'Designing intuitive products',
    dateOfBirth: new Date('2000-02-10T00:00:00.000Z'),
    location: 'Ho Chi Minh City',
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
      jobId: 'designer',
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
  profileSkills: [{ skill: { id: 'figma', displayNameEn: 'Figma' } }],
};

const jobFamilies = [
  {
    id: 'design',
    displayNameEn: 'Design',
    jobs: [{ id: 'designer', displayNameEn: 'Designer' }],
  },
];

function renderEditPage(ui: ReactElement) {
  const queryClient = new QueryClient();
  return renderWithI18n(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe('CandidateProfileEditPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireUser.mockResolvedValue({
      userId: 'candidate-1',
      role: 'candidate',
      email: 'lion@vridge.net',
      orgId: null,
    });
    mockGetJobFamilies.mockResolvedValue({
      success: true,
      data: jobFamilies,
    });
  });

  it('편집 페이지 섹션과 Save CTA 쉘을 렌더링하고 포트폴리오 플레이스홀더를 교체한다', async () => {
    mockGetMyProfile.mockResolvedValue({
      success: true,
      data: profileData,
    });

    const ui = await CandidateProfileEditPage();
    renderEditPage(ui);

    expect(
      screen.getByRole('heading', { name: 'Basic Profile' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Education' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Experience' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Certification' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Languages' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Portfolio' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'URL' })).toBeInTheDocument();

    expect(screen.getByText('File Upload')).toBeInTheDocument();
    expect(screen.getByText('Uploaded file')).toBeInTheDocument();
    expect(screen.queryByText(/Coming Soon/i)).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(document.querySelector('div.h-\\[81px\\]')).toBeInTheDocument();
  });

  it('학력/졸업 상태 드롭다운 라벨과 순서를 route-local 사양대로 렌더링한다', async () => {
    const user = userEvent.setup();
    mockGetMyProfile.mockResolvedValue({
      success: true,
      data: profileData,
    });

    const ui = await CandidateProfileEditPage();
    renderEditPage(ui);

    await user.click(screen.getByRole('button', { name: "Bachelor's Degree" }));

    const dropdownMenus = Array.from(
      document.querySelectorAll(
        'div.absolute.z-10.mt-1.w-full.rounded-\\[10px\\]'
      )
    );
    const educationMenuText =
      dropdownMenus[dropdownMenus.length - 1]?.textContent ?? '';

    expect(educationMenuText).toMatch(
      /High School Diploma[\s\S]*Associate Degree[\s\S]*Bachelor's Degree[\s\S]*Master's Degree[\s\S]*Doctoral Degree[\s\S]*Other/
    );

    await user.click(document.body);
    await user.click(screen.getByRole('button', { name: 'Graduated' }));

    const graduationMenus = Array.from(
      document.querySelectorAll(
        'div.absolute.z-10.mt-1.w-full.rounded-\\[10px\\]'
      )
    );
    const graduationMenuText =
      graduationMenus[graduationMenus.length - 1]?.textContent ?? '';

    expect(graduationMenuText).toMatch(
      /Enrolled[\s\S]*On Leave[\s\S]*Graduated[\s\S]*Expected to Graduate[\s\S]*Withdrawn/
    );
  });

  it('액션 에러가 발생하면 번역된 에러 메시지를 렌더링한다', async () => {
    mockGetMyProfile.mockResolvedValue({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound',
      errorMessage: '프로필을 찾을 수 없습니다.',
    });

    const ui = await CandidateProfileEditPage();
    renderEditPage(ui);

    expect(screen.getByText('프로필을 찾을 수 없습니다.')).toBeInTheDocument();
  });
});
