import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginModal } from '@/features/auth/ui/login-modal';
import { useAuthModal } from '@/features/auth/model/use-auth-modal';
import { signIn } from '@/lib/infrastructure/auth-client';

jest.mock('@/features/auth/model/use-auth-modal', () => ({
  useAuthModal: jest.fn(),
}));

jest.mock('@/lib/infrastructure/auth-client', () => ({
  signIn: { email: jest.fn(), social: jest.fn() },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockCloseAll = jest.fn();
const mockOpenSignup = jest.fn();

function mockModalState(isLoginOpen: boolean) {
  (useAuthModal as unknown as jest.Mock).mockReturnValue({
    isLoginOpen,
    closeAll: mockCloseAll,
    openSignup: mockOpenSignup,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LoginModal', () => {
  it('isLoginOpen=true 일 때 다이얼로그 렌더링', () => {
    mockModalState(true);
    render(<LoginModal />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('isLoginOpen=false 일 때 다이얼로그 미렌더링', () => {
    mockModalState(false);
    render(<LoginModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('"Sign Up" 클릭 시 openSignup() 호출', () => {
    mockModalState(true);
    render(<LoginModal />);
    fireEvent.click(screen.getByRole('button', { name: /^sign up$/i }));
    expect(mockOpenSignup).toHaveBeenCalledTimes(1);
  });

  it('이메일/비밀번호 입력 후 제출 시 signIn.email() 호출', async () => {
    (signIn.email as jest.Mock).mockResolvedValue({});
    mockModalState(true);
    render(<LoginModal />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(signIn.email).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123',
        })
      );
    });
  });

  it('Google 소셜 로그인 버튼 클릭 시 signIn.social() 호출', () => {
    mockModalState(true);
    render(<LoginModal />);
    fireEvent.click(screen.getByRole('button', { name: /google/i }));
    expect(signIn.social).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'google' })
    );
  });

  it('Facebook 소셜 로그인 버튼 클릭 시 signIn.social() 호출', () => {
    mockModalState(true);
    render(<LoginModal />);
    fireEvent.click(screen.getByRole('button', { name: /facebook/i }));
    expect(signIn.social).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'facebook' })
    );
  });

  it('Forgot password 링크가 렌더링됨', () => {
    mockModalState(true);
    render(<LoginModal />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });
});
