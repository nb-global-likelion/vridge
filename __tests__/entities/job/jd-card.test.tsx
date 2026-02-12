import { render, screen } from '@testing-library/react';
import { JdCard } from '@/entities/job/ui/jd-card';

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
    render(<JdCard {...baseProps} />);
    expect(screen.getByText('프론트엔드 개발자')).toBeInTheDocument();
    expect(screen.getByText('TechCo')).toBeInTheDocument();
  });

  it('renders salary formatted as "50M - 80M VND/년"', () => {
    render(<JdCard {...baseProps} />);
    expect(screen.getByText('50M - 80M VND/년')).toBeInTheDocument();
  });

  it('renders employment type label "정규직"', () => {
    render(<JdCard {...baseProps} />);
    expect(screen.getByText('정규직')).toBeInTheDocument();
  });

  it('renders skill badge', () => {
    render(<JdCard {...baseProps} />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders "협의" when salaryIsNegotiable is true', () => {
    render(<JdCard {...baseProps} salaryIsNegotiable={true} />);
    expect(screen.getByText('협의')).toBeInTheDocument();
  });
});
