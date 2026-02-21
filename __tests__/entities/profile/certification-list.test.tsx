import { screen } from '@testing-library/react';
import { CertificationList } from '@/frontend/entities/profile/ui/certification-list';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

describe('CertificationList', () => {
  it('자격증 목록 렌더링', () => {
    renderWithI18n(
      <CertificationList
        certifications={[
          {
            id: 'cert-1',
            name: 'AWS Certified Developer',
            date: new Date('2023-06-15'),
            description: 'Cloud development certification',
            institutionName: 'Amazon Web Services',
            sortOrder: 0,
          },
        ]}
      />,
      { locale: 'en' }
    );

    expect(screen.getByText('AWS Certified Developer')).toBeInTheDocument();
    expect(screen.getByText('Amazon Web Services')).toBeInTheDocument();
    expect(
      screen.getByText('Cloud development certification')
    ).toBeInTheDocument();
  });

  it('빈 목록이면 empty 상태 렌더링', () => {
    renderWithI18n(<CertificationList certifications={[]} />, {
      locale: 'en',
    });
    expect(screen.getByText('No certifications')).toBeInTheDocument();
  });
});
