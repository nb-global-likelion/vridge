import { screen } from '@testing-library/react';
import { CertificationForm } from '@/frontend/features/profile-edit/ui/certification-form';
import {
  useAddCertification,
  useUpdateCertification,
} from '@/frontend/features/profile-edit/model/use-profile-mutations';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock(
  '@/frontend/features/profile-edit/model/use-profile-mutations',
  () => ({
    useAddCertification: jest.fn(),
    useUpdateCertification: jest.fn(),
    useDeleteCertification: jest.fn(),
  })
);
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
    renderWithI18n(<CertificationForm onSuccess={jest.fn()} />);
    expect(screen.getByLabelText(/Certification\/License/i)).toHaveValue('');
    expect(screen.getByLabelText(/Institution/i)).toHaveValue('');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
  });

  it('편집 모드에서 초기값 렌더링', () => {
    renderWithI18n(
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

    expect(screen.getByLabelText(/Certification\/License/i)).toHaveValue(
      'AWS Certified Developer'
    );
    expect(screen.getByLabelText(/Institution/i)).toHaveValue('AWS');
    expect(screen.getByLabelText(/Description/i)).toHaveValue(
      'Cloud certificate'
    );
  });

  it('mutation pending 시 저장 버튼 비활성화', () => {
    (useAddCertification as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    renderWithI18n(<CertificationForm onSuccess={jest.fn()} />);
    expect(screen.getByRole('button', { name: /Save|Saving/i })).toBeDisabled();
  });
});
