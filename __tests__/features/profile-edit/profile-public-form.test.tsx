import { screen } from '@testing-library/react';
import { ProfilePublicForm } from '@/frontend/features/profile-edit/ui/profile-public-form';
import { useUpdateProfilePublic } from '@/frontend/features/profile-edit/model/use-profile-mutations';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock(
  '@/frontend/features/profile-edit/model/use-profile-mutations',
  () => ({
    useUpdateProfilePublic: jest.fn(),
  })
);
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
    renderWithI18n(
      <ProfilePublicForm
        initialData={{
          firstName: '길동',
          lastName: '홍',
          aboutMe: '소개',
          dateOfBirth: '1990-01-15',
          location: 'Seoul',
          isOpenToWork: true,
        }}
      />
    );

    expect(screen.getByLabelText(/First Name/i)).toHaveValue('길동');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('홍');
    expect(screen.getByLabelText(/Location/i)).toHaveValue('Seoul');
    expect(screen.getByLabelText(/About Me/i)).toHaveValue('소개');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('pending 시 저장 버튼 비활성화', () => {
    (useUpdateProfilePublic as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    renderWithI18n(
      <ProfilePublicForm
        initialData={{
          firstName: '길동',
          lastName: '홍',
        }}
      />
    );

    expect(screen.getByRole('button', { name: /Save|Saving/i })).toBeDisabled();
  });
});
