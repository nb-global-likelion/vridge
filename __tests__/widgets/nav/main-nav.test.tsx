import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainNav from '@/widgets/nav/ui/main-nav';

jest.mock('@/hooks/use-session', () => ({
  useSession: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/jobs'),
  useRouter: jest.fn(() => ({ refresh: jest.fn() })),
}));
jest.mock('@/lib/i18n/client', () => ({
  useI18n: jest.fn(),
  serializeLocaleCookie: jest.fn(() => 'vridge_locale=ko; path=/; max-age=1'),
}));
// UserMenu는 별도 테스트 — 여기서는 렌더링 여부만 확인
jest.mock('@/widgets/nav/ui/user-menu', () => ({
  __esModule: true,
  default: () => <div data-testid="user-menu" />,
}));

import { useSession } from '@/hooks/use-session';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/client';

const mockUseSession = useSession as unknown as jest.Mock;
const mockUsePathname = usePathname as unknown as jest.Mock;
const mockUseRouter = useRouter as unknown as jest.Mock;
const mockUseI18n = useI18n as unknown as jest.Mock;
const mockRefresh = jest.fn();

const translations: Record<string, string> = {
  'nav.jobs': 'Jobs',
  'nav.announcements': 'Announcement',
  'nav.login': 'Log in',
  'nav.signup': 'Sign Up',
  'locale.en': 'EN',
  'locale.ko': 'KR',
  'locale.vi': 'VN',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUsePathname.mockReturnValue('/jobs');
  mockUseRouter.mockReturnValue({ refresh: mockRefresh });
  mockUseI18n.mockReturnValue({
    locale: 'en',
    t: (key: string) => translations[key] ?? key,
  });
});

describe('MainNav', () => {
  it('Jobs, Announcement 링크 항상 렌더링', () => {
    mockUseSession.mockReturnValue({ data: null });
    render(<MainNav />);

    expect(screen.getByRole('link', { name: 'Jobs' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Announcement' })
    ).toBeInTheDocument();
  });

  it('미인증 — Log in, Sign Up 버튼 표시', () => {
    mockUseSession.mockReturnValue({ data: null });
    render(<MainNav />);

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument();
  });

  it('인증 — UserMenu 표시, Log in/Sign Up 숨김', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { name: 'Lion Park', email: 'lion@vridge.net', image: null },
      },
    });
    render(<MainNav />);

    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log in/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /sign up/i })
    ).not.toBeInTheDocument();
  });

  it('/jobs 경로 — Jobs 링크에 활성 클래스 적용', () => {
    mockUseSession.mockReturnValue({ data: null });
    mockUsePathname.mockReturnValue('/jobs');
    render(<MainNav />);

    const jobsLink = screen.getByRole('link', { name: 'Jobs' });
    expect(jobsLink.className).toContain('text-brand');
  });

  it('/announcements 경로 — Announcement 링크에 활성 클래스 적용', () => {
    mockUseSession.mockReturnValue({ data: null });
    mockUsePathname.mockReturnValue('/announcements');
    render(<MainNav />);

    const announcementLink = screen.getByRole('link', { name: 'Announcement' });
    expect(announcementLink.className).toContain('text-brand');
  });

  it('로고에 brand 액센트 점 포함', () => {
    mockUseSession.mockReturnValue({ data: null });
    render(<MainNav />);

    const logo = screen.getByRole('link', { name: /vridge/i });
    expect(logo).toBeInTheDocument();
    expect(logo.querySelector('.text-brand')).toBeInTheDocument();
    expect(logo.className).toContain('rounded-[80px]');
  });

  it('탭 메뉴 컨테이너 pill 스타일 적용', () => {
    mockUseSession.mockReturnValue({ data: null });
    render(<MainNav />);

    const jobsLink = screen.getByRole('link', { name: 'Jobs' });
    const menuContainer = jobsLink.parentElement;
    expect(menuContainer).toHaveClass('rounded-[80px]');
    expect(menuContainer).toHaveClass('shadow-[0_0_15px_rgba(255,149,84,0.2)]');
  });

  it('미인증 — 로그인 컨테이너 pill 스타일 표시', () => {
    mockUseSession.mockReturnValue({ data: null });
    render(<MainNav />);

    const loginButton = screen.getByRole('button', { name: /log in/i });
    const authContainer = loginButton.parentElement;
    expect(authContainer).toHaveClass('rounded-[80px]');
    expect(authContainer).toHaveClass('shadow-[0_0_15px_rgba(255,149,84,0.2)]');
  });

  it('언어 변경 시 refresh 호출', async () => {
    const user = userEvent.setup();
    mockUseSession.mockReturnValue({ data: null });
    render(<MainNav />);

    await user.click(screen.getByRole('button', { name: /EN/i }));
    await user.click(screen.getByRole('button', { name: 'KR' }));

    expect(mockRefresh).toHaveBeenCalled();
  });
});
