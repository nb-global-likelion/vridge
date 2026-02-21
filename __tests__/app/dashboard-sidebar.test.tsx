import { screen, fireEvent } from '@testing-library/react';
import DashboardSidebar from '@/app/(dashboard)/dashboard-sidebar';
import { signOut } from '@/backend/infrastructure/auth-client';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/backend/infrastructure/auth-client', () => ({
  signOut: jest.fn(),
}));

import { usePathname, useRouter } from 'next/navigation';

const mockUsePathname = usePathname as unknown as jest.Mock;
const mockUseRouter = useRouter as unknown as jest.Mock;
const mockSignOut = signOut as unknown as jest.Mock;
const mockPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockUseRouter.mockReturnValue({ push: mockPush });
  mockUsePathname.mockReturnValue('/candidate/profile');
});

describe('DashboardSidebar', () => {
  it('MY Page 메뉴를 렌더링한다', () => {
    renderWithI18n(<DashboardSidebar />);

    expect(screen.getByText('MY Page')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'My Profile' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My Jobs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('현재 경로 링크에 활성 색상을 적용한다', () => {
    renderWithI18n(<DashboardSidebar />);

    const active = screen.getByRole('link', { name: 'My Profile' });
    const inactive = screen.getByRole('link', { name: 'My Jobs' });

    expect(active.className).toContain('text-brand');
    expect(inactive.className).toContain('text-[#666]');
  });

  it('Logout 클릭 시 signOut을 호출한다', () => {
    renderWithI18n(<DashboardSidebar />);

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(mockSignOut).toHaveBeenCalledWith(
      expect.objectContaining({
        fetchOptions: expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      })
    );
  });
});
