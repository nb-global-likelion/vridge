import { act, renderHook } from '@testing-library/react';
import { useAuthModal } from '@/frontend/features/auth/model/use-auth-modal';

// Zustand 스토어 초기화 — 각 테스트 후 상태 리셋
beforeEach(() => {
  useAuthModal.setState({ isLoginOpen: false, isSignupOpen: false });
});

describe('useAuthModal', () => {
  it('초기 상태: 모달 모두 닫힘', () => {
    const { result } = renderHook(() => useAuthModal());
    expect(result.current.isLoginOpen).toBe(false);
    expect(result.current.isSignupOpen).toBe(false);
  });

  it('openLogin(): 로그인 모달 열림, 회원가입 모달 닫힘', () => {
    const { result } = renderHook(() => useAuthModal());
    act(() => result.current.openLogin());
    expect(result.current.isLoginOpen).toBe(true);
    expect(result.current.isSignupOpen).toBe(false);
  });

  it('openSignup(): 회원가입 모달 열림, 로그인 모달 닫힘', () => {
    const { result } = renderHook(() => useAuthModal());
    act(() => result.current.openLogin());
    act(() => result.current.openSignup());
    expect(result.current.isSignupOpen).toBe(true);
    expect(result.current.isLoginOpen).toBe(false);
  });

  it('closeAll(): 모든 모달 닫힘', () => {
    const { result } = renderHook(() => useAuthModal());
    act(() => result.current.openLogin());
    act(() => result.current.closeAll());
    expect(result.current.isLoginOpen).toBe(false);
    expect(result.current.isSignupOpen).toBe(false);
  });
});
