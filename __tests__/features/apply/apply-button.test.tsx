import { screen, fireEvent } from '@testing-library/react';
import { ApplyButton } from '@/features/apply/ui/apply-button';
import {
  useCreateApply,
  useWithdrawApply,
} from '@/features/apply/model/use-apply-mutations';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('@/features/apply/model/use-apply-mutations', () => ({
  useCreateApply: jest.fn(),
  useWithdrawApply: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ refresh: jest.fn() })),
}));

const JD_ID = '123e4567-e89b-12d3-a456-426614174000';

describe('ApplyButton', () => {
  const mockMutate = jest.fn();
  const renderWithKo = (ui: Parameters<typeof renderWithI18n>[0]) =>
    renderWithI18n(ui, { locale: 'ko' });

  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateApply as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    });
    (useWithdrawApply as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it('renders "지원하기" when not applied', () => {
    renderWithKo(<ApplyButton jdId={JD_ID} initialApplied={false} />);
    expect(
      screen.getByRole('button', { name: '지원하기' })
    ).toBeInTheDocument();
  });

  it('renders "지원완료" and "철회" when applied', () => {
    renderWithKo(
      <ApplyButton jdId={JD_ID} initialApplied={true} applyId="apply-id-1" />
    );
    expect(screen.getByText(/지원완료/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '철회' })).toBeInTheDocument();
  });

  it('"지원하기" click calls mutate with jdId', () => {
    renderWithKo(<ApplyButton jdId={JD_ID} initialApplied={false} />);
    fireEvent.click(screen.getByRole('button', { name: '지원하기' }));
    expect(mockMutate).toHaveBeenCalledWith(JD_ID, expect.any(Object));
  });

  it('button is disabled when isPending', () => {
    (useCreateApply as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      error: null,
    });
    renderWithKo(<ApplyButton jdId={JD_ID} initialApplied={false} />);
    expect(
      screen.getByRole('button', { name: /지원하기|지원 중/ })
    ).toBeDisabled();
  });

  it('shows error message when isError', () => {
    (useCreateApply as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: { message: '지원 오류' },
    });
    renderWithKo(<ApplyButton jdId={JD_ID} initialApplied={false} />);
    expect(screen.getByText('지원 오류')).toBeInTheDocument();
  });
});
