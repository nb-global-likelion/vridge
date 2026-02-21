import { screen } from '@testing-library/react';
import { SkillBadges } from '@/frontend/entities/profile/ui/skill-badges';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

describe('SkillBadges', () => {
  it('renders each skill displayNameEn', () => {
    const skills = [
      { skill: { displayNameEn: 'TypeScript' } },
      { skill: { displayNameEn: 'React' } },
    ];
    const { container } = renderWithI18n(<SkillBadges skills={skills} />, {
      locale: 'en',
    });
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="chip"]')).toHaveLength(2);
  });

  it('renders empty state when skills is empty', () => {
    renderWithI18n(<SkillBadges skills={[]} />, { locale: 'en' });
    expect(screen.getByText('No skills added')).toBeInTheDocument();
  });
});
