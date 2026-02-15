import { render, screen } from '@testing-library/react';
import { LanguageForm } from '@/features/profile-edit/ui/language-form';
import {
  useAddLanguage,
  useUpdateLanguage,
} from '@/features/profile-edit/model/use-profile-mutations';

jest.mock('@/features/profile-edit/model/use-profile-mutations', () => ({
  useAddLanguage: jest.fn(),
  useUpdateLanguage: jest.fn(),
  useDeleteLanguage: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ refresh: jest.fn() })),
}));

describe('LanguageForm', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAddLanguage as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useUpdateLanguage as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('추가 모드에서 기본 필드 렌더링', () => {
    render(<LanguageForm onSuccess={jest.fn()} />);
    expect(screen.getByLabelText(/언어/i)).toHaveValue('');
    expect(screen.getByLabelText(/시험명/i)).toHaveValue('');
    expect(screen.getByLabelText(/점수/i)).toHaveValue('');
  });

  it('편집 모드에서 초기값 렌더링', () => {
    render(
      <LanguageForm
        onSuccess={jest.fn()}
        languageId="lang-1"
        initialData={{
          language: 'English',
          proficiency: 'fluent',
          testName: 'TOEFL',
          testScore: '100',
          sortOrder: 0,
        }}
      />
    );

    expect(screen.getByLabelText(/언어/i)).toHaveValue('English');
    expect(screen.getByLabelText(/시험명/i)).toHaveValue('TOEFL');
    expect(screen.getByLabelText(/점수/i)).toHaveValue('100');
  });

  it('mutation pending 시 저장 버튼 비활성화', () => {
    (useAddLanguage as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<LanguageForm onSuccess={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: /저장|저장 중/i })
    ).toBeDisabled();
  });
});
