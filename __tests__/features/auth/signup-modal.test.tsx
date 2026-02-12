import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupModal } from '@/features/auth/ui/signup-modal';
import { useAuthModal } from '@/features/auth/model/use-auth-modal';
import { signUp } from '@/lib/infrastructure/auth-client';

jest.mock('@/features/auth/model/use-auth-modal', () => ({
  useAuthModal: jest.fn(),
}));

jest.mock('@/lib/infrastructure/auth-client', () => ({
  signUp: { email: jest.fn() },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockCloseAll = jest.fn();
const mockOpenLogin = jest.fn();

function mockModalState(isSignupOpen: boolean) {
  (useAuthModal as unknown as jest.Mock).mockReturnValue({
    isSignupOpen,
    closeAll: mockCloseAll,
    openLogin: mockOpenLogin,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SignupModal', () => {
  it('isSignupOpen=true 일 때 다이얼로그 렌더링', () => {
    mockModalState(true);
    render(<SignupModal />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('isSignupOpen=false 일 때 다이얼로그 미렌더링', () => {
    mockModalState(false);
    render(<SignupModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('"Log in" 클릭 시 openLogin() 호출', () => {
    mockModalState(true);
    render(<SignupModal />);
    fireEvent.click(screen.getByText(/log in/i));
    expect(mockOpenLogin).toHaveBeenCalledTimes(1);
  });

  it('전체 필드 입력 후 제출 시 signUp.email() 호출', async () => {
    (signUp.email as jest.Mock).mockResolvedValue({});
    mockModalState(true);
    render(<SignupModal />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(signUp.email).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
      );
    });
  });
});
