import { render, screen } from '@testing-library/react';
import { LanguageList } from '@/entities/profile/ui/language-list';

const baseLanguage = {
  id: 'lang-1',
  language: 'English',
  proficiency: 'professional',
  sortOrder: 0,
};

describe('LanguageList', () => {
  it('언어와 숙련도 렌더링', () => {
    render(<LanguageList languages={[baseLanguage]} />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('업무 가능')).toBeInTheDocument();
  });

  it('testName/testScore 함께 있으면 점수 정보 렌더링', () => {
    render(
      <LanguageList
        languages={[
          {
            ...baseLanguage,
            testName: 'TOEFL',
            testScore: '100',
          },
        ]}
      />
    );
    expect(screen.getByText('TOEFL · 100')).toBeInTheDocument();
  });

  it('빈 목록이면 empty 상태 렌더링', () => {
    render(<LanguageList languages={[]} />);
    expect(screen.getByText('등록된 언어 없음')).toBeInTheDocument();
  });
});
