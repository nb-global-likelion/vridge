import { render, screen } from '@testing-library/react';
import { CareerForm } from '@/features/profile-edit/ui/career-form';
import {
  useAddCareer,
  useUpdateCareer,
} from '@/features/profile-edit/model/use-profile-mutations';

jest.mock('@/features/profile-edit/model/use-profile-mutations', () => ({
  useAddCareer: jest.fn(),
  useUpdateCareer: jest.fn(),
  useDeleteCareer: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ refresh: jest.fn() })),
}));

const jobFamilies = [
  {
    id: 'eng',
    displayNameEn: 'Engineering',
    jobs: [{ id: 'swe', displayNameEn: 'Software Engineer' }],
  },
];

describe('CareerForm', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAddCareer as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useUpdateCareer as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('renders add mode with empty companyName and 저장 button', () => {
    render(<CareerForm jobFamilies={jobFamilies} onSuccess={jest.fn()} />);
    const input = screen.getByLabelText(/회사명/i);
    expect(input).toHaveValue('');
    expect(screen.getByRole('button', { name: /저장/i })).toBeInTheDocument();
  });

  it('renders experience level dropdown', () => {
    render(<CareerForm jobFamilies={jobFamilies} onSuccess={jest.fn()} />);
    expect(screen.getByText('경력 레벨 (선택)')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /레벨 선택/i })
    ).toBeInTheDocument();
  });

  it('renders edit mode with pre-filled companyName', () => {
    render(
      <CareerForm
        jobFamilies={jobFamilies}
        onSuccess={jest.fn()}
        careerId="c1"
        initialData={{
          companyName: '삼성전자',
          positionTitle: '개발자',
          jobId: 'swe',
          employmentType: 'full_time',
          startDate: '2021-01-01',
          endDate: undefined,
          description: undefined,
          sortOrder: 0,
        }}
      />
    );
    expect(screen.getByLabelText(/회사명/i)).toHaveValue('삼성전자');
  });

  it('button is disabled when isPending', () => {
    (useAddCareer as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });
    render(<CareerForm jobFamilies={jobFamilies} onSuccess={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: /저장|저장 중/i })
    ).toBeDisabled();
  });
});
