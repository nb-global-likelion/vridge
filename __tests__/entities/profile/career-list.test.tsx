import { screen } from '@testing-library/react';
import { CareerList } from '@/entities/profile/ui/career-list';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

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
    renderWithI18n(<CareerList careers={[baseCareer]} />, { locale: 'en' });
    expect(screen.getByText('삼성전자')).toBeInTheDocument();
    expect(screen.getByText('시니어 개발자')).toBeInTheDocument();
  });

  it('renders job displayNameEn', () => {
    renderWithI18n(<CareerList careers={[baseCareer]} />, { locale: 'en' });
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('renders employment type label as chip', () => {
    const { container } = renderWithI18n(
      <CareerList careers={[baseCareer]} />,
      {
        locale: 'en',
      }
    );
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="chip"]')).toHaveLength(1);
  });

  it('formats startDate as YYYY.MM', () => {
    renderWithI18n(<CareerList careers={[baseCareer]} />, { locale: 'en' });
    expect(screen.getByText(/2021\.03/)).toBeInTheDocument();
  });

  it('renders 현재 when endDate is null', () => {
    renderWithI18n(<CareerList careers={[baseCareer]} />, { locale: 'en' });
    expect(screen.getByText(/Present/)).toBeInTheDocument();
  });

  it('renders formatted endDate when provided', () => {
    const career = { ...baseCareer, endDate: new Date('2023-06-01') };
    renderWithI18n(<CareerList careers={[career]} />, { locale: 'en' });
    expect(screen.getByText(/2023\.06/)).toBeInTheDocument();
  });

  it('renders empty state when careers is empty', () => {
    renderWithI18n(<CareerList careers={[]} />, { locale: 'en' });
    expect(screen.getByText('No career history')).toBeInTheDocument();
  });

  it('renders experience level when provided', () => {
    const career = { ...baseCareer, experienceLevel: 'SENIOR' };
    const { container } = renderWithI18n(<CareerList careers={[career]} />, {
      locale: 'en',
    });
    expect(screen.getByText('Senior')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="chip"]')).toHaveLength(2);
  });
});
