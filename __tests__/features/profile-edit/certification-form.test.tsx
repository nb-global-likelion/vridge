import { render, screen } from '@testing-library/react';
import { CertificationForm } from '@/features/profile-edit/ui/certification-form';
import {
  useAddCertification,
  useUpdateCertification,
} from '@/features/profile-edit/model/use-profile-mutations';

jest.mock('@/features/profile-edit/model/use-profile-mutations', () => ({
  useAddCertification: jest.fn(),
  useUpdateCertification: jest.fn(),
  useDeleteCertification: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ refresh: jest.fn() })),
}));

describe('CertificationForm', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAddCertification as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useUpdateCertification as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('추가 모드에서 필드 렌더링', () => {
    render(<CertificationForm onSuccess={jest.fn()} />);
    expect(screen.getByLabelText(/자격증명/i)).toHaveValue('');
    expect(screen.getByLabelText(/발급 기관/i)).toHaveValue('');
    expect(screen.getByLabelText(/설명/i)).toHaveValue('');
  });

  it('편집 모드에서 초기값 렌더링', () => {
    render(
      <CertificationForm
        onSuccess={jest.fn()}
        certificationId="cert-1"
        initialData={{
          name: 'AWS Certified Developer',
          date: '2023-06-15',
          institutionName: 'AWS',
          description: 'Cloud certificate',
          sortOrder: 0,
        }}
      />
    );

    expect(screen.getByLabelText(/자격증명/i)).toHaveValue(
      'AWS Certified Developer'
    );
    expect(screen.getByLabelText(/발급 기관/i)).toHaveValue('AWS');
    expect(screen.getByLabelText(/설명/i)).toHaveValue('Cloud certificate');
  });

  it('mutation pending 시 저장 버튼 비활성화', () => {
    (useAddCertification as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<CertificationForm onSuccess={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: /저장|저장 중/i })
    ).toBeDisabled();
  });
});
