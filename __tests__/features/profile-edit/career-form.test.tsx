import { screen } from '@testing-library/react';
import { CareerForm } from '@/features/profile-edit/ui/career-form';
import {
  useAddCareer,
  useUpdateCareer,
} from '@/features/profile-edit/model/use-profile-mutations';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

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
    renderWithI18n(
      <CareerForm jobFamilies={jobFamilies} onSuccess={jest.fn()} />
    );
    const input = screen.getByLabelText(/Company Name/i);
    expect(input).toHaveValue('');
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('renders experience level dropdown', () => {
    renderWithI18n(
      <CareerForm jobFamilies={jobFamilies} onSuccess={jest.fn()} />
    );
    expect(screen.getByText('Experience level')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select/i })).toBeInTheDocument();
  });

  it('renders edit mode with pre-filled companyName', () => {
    renderWithI18n(
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
    expect(screen.getByLabelText(/Company Name/i)).toHaveValue('삼성전자');
  });

  it('button is disabled when isPending', () => {
    (useAddCareer as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });
    renderWithI18n(
      <CareerForm jobFamilies={jobFamilies} onSuccess={jest.fn()} />
    );
    expect(screen.getByRole('button', { name: /Save|Saving/i })).toBeDisabled();
  });
});
