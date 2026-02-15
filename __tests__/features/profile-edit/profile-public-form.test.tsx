import { render, screen } from '@testing-library/react';
import { ProfilePublicForm } from '@/features/profile-edit/ui/profile-public-form';
import { useUpdateProfilePublic } from '@/features/profile-edit/model/use-profile-mutations';

jest.mock('@/features/profile-edit/model/use-profile-mutations', () => ({
  useUpdateProfilePublic: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ refresh: jest.fn() })),
}));

describe('ProfilePublicForm', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUpdateProfilePublic as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('신규 필드 포함 렌더링', () => {
    render(
      <ProfilePublicForm
        initialData={{
          firstName: '길동',
          lastName: '홍',
          aboutMe: '소개',
          dateOfBirth: '1990-01-15',
          location: 'Seoul',
          headline: 'Frontend Engineer',
          isOpenToWork: true,
        }}
      />
    );

    expect(screen.getByLabelText(/이름/i)).toHaveValue('길동');
    expect(screen.getByLabelText(/성/i)).toHaveValue('홍');
    expect(screen.getByLabelText(/지역/i)).toHaveValue('Seoul');
    expect(screen.getByLabelText(/헤드라인/i)).toHaveValue('Frontend Engineer');
    expect(screen.getByLabelText(/소개/i)).toHaveValue('소개');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('pending 시 저장 버튼 비활성화', () => {
    (useUpdateProfilePublic as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(
      <ProfilePublicForm
        initialData={{
          firstName: '길동',
          lastName: '홍',
        }}
      />
    );

    expect(
      screen.getByRole('button', { name: /저장|저장 중/i })
    ).toBeDisabled();
  });
});
