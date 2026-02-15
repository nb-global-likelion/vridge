import { render, screen } from '@testing-library/react';
import { CareerList } from '@/entities/profile/ui/career-list';

const baseCareer = {
  id: '1',
  companyName: '삼성전자',
  positionTitle: '시니어 개발자',
  employmentType: 'full_time',
  startDate: new Date('2021-03-01'),
  endDate: null,
  description: null,
  experienceLevel: null,
  sortOrder: 0,
  job: { displayNameEn: 'Software Engineer' },
};

describe('CareerList', () => {
  it('renders company and position', () => {
    render(<CareerList careers={[baseCareer]} />);
    expect(screen.getByText('삼성전자')).toBeInTheDocument();
    expect(screen.getByText('시니어 개발자')).toBeInTheDocument();
  });

  it('renders job displayNameEn', () => {
    render(<CareerList careers={[baseCareer]} />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('renders employment type label as badge', () => {
    render(<CareerList careers={[baseCareer]} />);
    expect(screen.getByText('정규직')).toBeInTheDocument();
  });

  it('formats startDate as YYYY.MM', () => {
    render(<CareerList careers={[baseCareer]} />);
    expect(screen.getByText(/2021\.03/)).toBeInTheDocument();
  });

  it('renders 현재 when endDate is null', () => {
    render(<CareerList careers={[baseCareer]} />);
    expect(screen.getByText(/현재/)).toBeInTheDocument();
  });

  it('renders formatted endDate when provided', () => {
    const career = { ...baseCareer, endDate: new Date('2023-06-01') };
    render(<CareerList careers={[career]} />);
    expect(screen.getByText(/2023\.06/)).toBeInTheDocument();
  });

  it('renders empty state when careers is empty', () => {
    render(<CareerList careers={[]} />);
    expect(screen.getByText('경력 없음')).toBeInTheDocument();
  });

  it('renders experience level when provided', () => {
    const career = { ...baseCareer, experienceLevel: 'SENIOR' };
    render(<CareerList careers={[career]} />);
    expect(screen.getByText('Senior')).toBeInTheDocument();
  });
});
