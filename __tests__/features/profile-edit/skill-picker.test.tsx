import { screen, fireEvent } from '@testing-library/react';
import { SkillPicker } from '@/frontend/features/profile-edit/ui/skill-picker';
import {
  useAddSkill,
  useDeleteSkill,
} from '@/frontend/features/profile-edit/model/use-profile-mutations';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

jest.mock('@/backend/actions/catalog', () => ({ searchSkills: jest.fn() }));
jest.mock(
  '@/frontend/features/profile-edit/model/use-profile-mutations',
  () => ({
    useAddSkill: jest.fn(),
    useDeleteSkill: jest.fn(),
  })
);
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ refresh: jest.fn() })),
}));

const currentSkills = [
  { skill: { id: 'typescript', displayNameEn: 'TypeScript' } },
  { skill: { id: 'react', displayNameEn: 'React' } },
];

describe('SkillPicker', () => {
  const mockDeleteMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAddSkill as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useDeleteSkill as jest.Mock).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    });
  });

  it('renders existing skill names', () => {
    renderWithI18n(<SkillPicker currentSkills={currentSkills} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders a remove button for each skill', () => {
    renderWithI18n(<SkillPicker currentSkills={currentSkills} />);
    const removeButtons = screen.getAllByRole('button', {
      name: /Remove/i,
    });
    expect(removeButtons).toHaveLength(currentSkills.length);
  });

  it('calls deleteSkill.mutate with skill id when remove is clicked', () => {
    renderWithI18n(<SkillPicker currentSkills={currentSkills} />);
    const removeButtons = screen.getAllByRole('button', {
      name: /Remove/i,
    });
    fireEvent.click(removeButtons[0]);
    expect(mockDeleteMutate).toHaveBeenCalledWith(
      'typescript',
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
  });
});
