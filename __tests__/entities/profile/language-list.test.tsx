import { screen } from '@testing-library/react';
import { LanguageList } from '@/frontend/entities/profile/ui/language-list';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

const baseLanguage = {
  id: 'lang-1',
  language: 'English',
  proficiency: 'professional',
  sortOrder: 0,
};

describe('LanguageList', () => {
  it('언어와 숙련도 렌더링 + 숙련도 chip 사용', () => {
    const { container } = renderWithI18n(
      <LanguageList languages={[baseLanguage]} />,
      { locale: 'en' }
    );
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="chip"]')).toHaveLength(1);
  });

  it('testName/testScore 함께 있으면 점수 정보 렌더링', () => {
    renderWithI18n(
      <LanguageList
        languages={[
          {
            ...baseLanguage,
            testName: 'TOEFL',
            testScore: '100',
          },
        ]}
      />,
      { locale: 'en' }
    );
    expect(screen.getByText('TOEFL · 100')).toBeInTheDocument();
  });

  it('빈 목록이면 empty 상태 렌더링', () => {
    renderWithI18n(<LanguageList languages={[]} />, { locale: 'en' });
    expect(screen.getByText('No languages added')).toBeInTheDocument();
  });
});
