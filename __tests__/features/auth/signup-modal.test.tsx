import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { SignupModal } from '@/features/auth/ui/signup-modal';
import { useAuthModal } from '@/features/auth/model/use-auth-modal';
import { signIn, signUp } from '@/lib/infrastructure/auth-client';

jest.mock('@/features/auth/model/use-auth-modal', () => ({
  useAuthModal: jest.fn(),
}));

jest.mock('@/lib/infrastructure/auth-client', () => ({
  signIn: { social: jest.fn() },
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

  describe('Step 1: 가입 방법 선택', () => {
    it('Google/Facebook/Email 버튼 렌더링', () => {
      mockModalState(true);
      render(<SignupModal />);
      expect(
        screen.getByRole('button', { name: /google/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /facebook/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /email/i })
      ).toBeInTheDocument();
    });

    it('Google 버튼 클릭 시 signIn.social() 호출', () => {
      mockModalState(true);
      render(<SignupModal />);
      fireEvent.click(screen.getByRole('button', { name: /google/i }));
      expect(signIn.social).toHaveBeenCalledWith(
        expect.objectContaining({ provider: 'google' })
      );
    });

    it('Facebook 버튼 클릭 시 signIn.social() 호출', () => {
      mockModalState(true);
      render(<SignupModal />);
      fireEvent.click(screen.getByRole('button', { name: /facebook/i }));
      expect(signIn.social).toHaveBeenCalledWith(
        expect.objectContaining({ provider: 'facebook' })
      );
    });

    it('Email 버튼 클릭 시 step 2로 이동', () => {
      mockModalState(true);
      render(<SignupModal />);
      fireEvent.click(screen.getByRole('button', { name: /email/i }));
      // step 2에서는 email input이 보여야 함
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('"Log in" 클릭 시 openLogin() 호출', () => {
      mockModalState(true);
      render(<SignupModal />);
      fireEvent.click(screen.getByText(/log in/i));
      expect(mockOpenLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('Step 2: 이메일 가입 폼', () => {
    function goToStep2() {
      mockModalState(true);
      render(<SignupModal />);
      fireEvent.click(screen.getByRole('button', { name: /email/i }));
    }

    it('email, password 필드가 보이고 name, confirmPassword 필드는 없음', () => {
      goToStep2();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/confirm password/i)
      ).not.toBeInTheDocument();
    });

    it('개인정보 동의 체크박스 존재, 미체크 시 제출 버튼 비활성화', () => {
      goToStep2();
      const checkbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      expect(checkbox).not.toBeChecked();
      expect(submitButton).toBeDisabled();
    });

    it('개인정보 동의 체크 시 제출 버튼 활성화', () => {
      goToStep2();
      const checkbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(submitButton).not.toBeDisabled();
    });

    it('제출 시 signUp.email()에 name=email.split("@")[0] 전달', async () => {
      (signUp.email as jest.Mock).mockResolvedValue({});
      goToStep2();

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'testuser@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });
      // 체크박스 체크
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(signUp.email).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
          })
        );
      });
    });
  });

  describe('모달 닫기 후 재오픈 시 step 1으로 리셋', () => {
    it('step 2에서 모달 닫고 다시 열면 step 1 표시', async () => {
      jest.useFakeTimers();
      mockModalState(true);
      const { rerender } = render(<SignupModal />);
      // step 2로 이동
      fireEvent.click(screen.getByRole('button', { name: /email/i }));
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

      // 모달 닫기 → useEffect setTimeout으로 step 리셋
      mockModalState(false);
      rerender(<SignupModal />);

      // setTimeout 실행
      await act(async () => {
        jest.runAllTimers();
      });

      // 모달 다시 열기
      mockModalState(true);
      rerender(<SignupModal />);

      // step 1의 Google/Facebook/Email 버튼이 보여야 함
      expect(
        screen.getByRole('button', { name: /google/i })
      ).toBeInTheDocument();

      jest.useRealTimers();
    });
  });
});
