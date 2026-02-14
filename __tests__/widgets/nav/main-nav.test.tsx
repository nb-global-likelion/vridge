import { render, screen } from '@testing-library/react';
import MainNav from '@/widgets/nav/ui/main-nav';

jest.mock('@/hooks/use-session', () => ({
  useSession: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/jobs'),
}));
// UserMenu는 별도 테스트 — 여기서는 렌더링 여부만 확인
jest.mock('@/widgets/nav/ui/user-menu', () => ({
  __esModule: true,
  default: () => <div data-testid="user-menu" />,
}));

import { useSession } from '@/hooks/use-session';
import { usePathname } from 'next/navigation';

const mockUseSession = useSession as unknown as jest.Mock;
const mockUsePathname = usePathname as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockUsePathname.mockReturnValue('/jobs');
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

  it('/announcement 경로 — Announcement 링크에 활성 클래스 적용', () => {
    mockUseSession.mockReturnValue({ data: null });
    mockUsePathname.mockReturnValue('/announcement');
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
  });

  it('네비게이션 shadow 스타일 적용', () => {
    mockUseSession.mockReturnValue({ data: null });
    render(<MainNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('shadow-[0_4px_13px_rgba(0,0,0,0.04)]');
  });

  it('미인증 — Log in | Sign Up 구분선 표시', () => {
    mockUseSession.mockReturnValue({ data: null });
    render(<MainNav />);

    expect(screen.getByText('|')).toBeInTheDocument();
  });
});
