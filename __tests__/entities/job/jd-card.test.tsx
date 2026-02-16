import { screen } from '@testing-library/react';
import { JdCard } from '@/entities/job/ui/jd-card';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

const baseProps = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: '프론트엔드 개발자',
  jobDisplayNameEn: 'Frontend Engineer',
  jobFamilyDisplayNameEn: 'Engineering',
  orgName: 'TechCo',
  employmentType: 'full_time',
  workArrangement: 'remote',
  salaryMin: 50_000_000,
  salaryMax: 80_000_000,
  salaryCurrency: 'VND',
  salaryPeriod: 'year',
  salaryIsNegotiable: false,
  skills: [{ skill: { displayNameEn: 'React' } }],
  createdAt: new Date('2025-01-01'),
  href: '/jobs/123e4567-e89b-12d3-a456-426614174000',
};

describe('JdCard', () => {
  it('renders title and orgName', () => {
    renderWithI18n(<JdCard {...baseProps} />, { locale: 'en' });
    expect(screen.getByText('프론트엔드 개발자')).toBeInTheDocument();
    expect(screen.getByText('TechCo')).toBeInTheDocument();
  });

  it('renders salary formatted as "50M - 80M VND/year"', () => {
    renderWithI18n(<JdCard {...baseProps} />, { locale: 'en' });
    expect(screen.getByText('50M - 80M VND/year')).toBeInTheDocument();
  });

  it('renders employment type label "Full-time"', () => {
    renderWithI18n(<JdCard {...baseProps} />, { locale: 'en' });
    expect(screen.getByText('Full-time')).toBeInTheDocument();
  });

  it('renders skill badge', () => {
    renderWithI18n(<JdCard {...baseProps} />, { locale: 'en' });
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders "Negotiable" when salaryIsNegotiable is true', () => {
    renderWithI18n(<JdCard {...baseProps} salaryIsNegotiable={true} />, {
      locale: 'en',
    });
    expect(screen.getByText('Negotiable')).toBeInTheDocument();
  });
});
