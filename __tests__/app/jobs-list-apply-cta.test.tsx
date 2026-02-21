import { fireEvent, screen, waitFor } from '@testing-library/react';
import { JobsListApplyCta } from '@/app/jobs/_jobs-list-apply-cta';
import { useCreateApply } from '@/frontend/features/apply/model/use-apply-mutations';
import { useAuthModal } from '@/frontend/features/auth/model/use-auth-modal';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('@/frontend/features/apply/model/use-apply-mutations', () => ({
  useCreateApply: jest.fn(),
}));

jest.mock('@/frontend/features/auth/model/use-auth-modal', () => ({
  useAuthModal: jest.fn(),
}));

const mockUseCreateApply = useCreateApply as unknown as jest.Mock;
const mockUseAuthModal = useAuthModal as unknown as jest.Mock;

describe('JobsListApplyCta', () => {
  const mockMutate = jest.fn();
  const mockOpenLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCreateApply.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    mockUseAuthModal.mockReturnValue({
      openLogin: mockOpenLogin,
    });
  });

  it('게스트 클릭 시 로그인 모달을 연다', () => {
    renderWithI18n(
      <JobsListApplyCta
        jdId="jd-1"
        status="recruiting"
        isAuthenticated={false}
        isCandidate={false}
        isApplied={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Apply Now' }));
    expect(mockOpenLogin).toHaveBeenCalledTimes(1);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('후보자 클릭 시 직접 지원 mutate를 호출한다', async () => {
    mockMutate.mockImplementation(
      (_: string, options?: { onSuccess?: () => void }) => {
        options?.onSuccess?.();
      }
    );

    renderWithI18n(
      <JobsListApplyCta
        jdId="jd-1"
        status="recruiting"
        isAuthenticated={true}
        isCandidate={true}
        isApplied={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Apply Now' }));
    expect(mockMutate).toHaveBeenCalledWith('jd-1', expect.any(Object));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Applied/i })
      ).toBeInTheDocument();
    });
  });

  it('이미 지원한 경우 Applied 비활성 스타일을 렌더링한다', () => {
    renderWithI18n(
      <JobsListApplyCta
        jdId="jd-1"
        status="recruiting"
        isAuthenticated={true}
        isCandidate={true}
        isApplied={true}
      />
    );

    const button = screen.getByRole('button', { name: /Applied/i });
    expect(button).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(button);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('done 공고는 인증 상태와 무관하게 Apply Now 비활성 상태다', () => {
    renderWithI18n(
      <JobsListApplyCta
        jdId="jd-2"
        status="done"
        isAuthenticated={true}
        isCandidate={true}
        isApplied={false}
      />
    );

    const button = screen.getByRole('button', { name: 'Apply Now' });
    expect(button).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(button);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('후보자가 아닌 로그인 사용자는 Apply Now가 비활성이다', () => {
    renderWithI18n(
      <JobsListApplyCta
        jdId="jd-3"
        status="recruiting"
        isAuthenticated={true}
        isCandidate={false}
        isApplied={false}
      />
    );

    const button = screen.getByRole('button', { name: 'Apply Now' });
    expect(button).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(button);
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
