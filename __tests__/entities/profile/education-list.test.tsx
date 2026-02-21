import { screen } from '@testing-library/react';
import { EducationList } from '@/frontend/entities/profile/ui/education-list';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

const baseEducation = {
  id: 'edu-1',
  institutionName: '서울대학교',
  educationType: 'higher_bachelor',
  field: 'Computer Science',
  graduationStatus: 'GRADUATED',
  startDate: new Date('2018-03-01'),
  endDate: new Date('2022-02-01'),
  sortOrder: 0,
};

describe('EducationList', () => {
  it('기관/유형/상태/기간 렌더링', () => {
    renderWithI18n(<EducationList educations={[baseEducation]} />, {
      locale: 'en',
    });
    expect(screen.getByText('서울대학교')).toBeInTheDocument();
    expect(screen.getByText("Bachelor's")).toBeInTheDocument();
    expect(screen.getByText('Graduated')).toBeInTheDocument();
    expect(screen.getByText(/2018\.03/)).toBeInTheDocument();
    expect(screen.getByText(/2022\.02/)).toBeInTheDocument();
  });

  it('유형/상태를 chip으로 렌더링', () => {
    const { container } = renderWithI18n(
      <EducationList educations={[baseEducation]} />,
      { locale: 'en' }
    );
    expect(container.querySelectorAll('[data-slot="chip"]')).toHaveLength(2);
  });

  it('전공이 있으면 전공 렌더링', () => {
    renderWithI18n(<EducationList educations={[baseEducation]} />, {
      locale: 'en',
    });
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('endDate가 없으면 현재 렌더링', () => {
    renderWithI18n(
      <EducationList educations={[{ ...baseEducation, endDate: null }]} />,
      { locale: 'en' }
    );
    expect(screen.getByText(/Present/)).toBeInTheDocument();
  });

  it('알 수 없는 유형/상태는 원본 값 fallback', () => {
    renderWithI18n(
      <EducationList
        educations={[
          {
            ...baseEducation,
            educationType: 'custom_type',
            graduationStatus: 'custom_status',
          },
        ]}
      />,
      { locale: 'en' }
    );
    expect(screen.getByText('custom_type')).toBeInTheDocument();
    expect(screen.getByText('custom_status')).toBeInTheDocument();
  });

  it('빈 목록이면 empty 상태 렌더링', () => {
    renderWithI18n(<EducationList educations={[]} />, { locale: 'en' });
    expect(screen.getByText('No education history')).toBeInTheDocument();
  });
});
