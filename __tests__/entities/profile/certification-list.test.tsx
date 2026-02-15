import { render, screen } from '@testing-library/react';
import { CertificationList } from '@/entities/profile/ui/certification-list';

describe('CertificationList', () => {
  it('자격증 목록 렌더링', () => {
    render(
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
      />
    );

    expect(screen.getByText('AWS Certified Developer')).toBeInTheDocument();
    expect(screen.getByText('Amazon Web Services')).toBeInTheDocument();
    expect(
      screen.getByText('Cloud development certification')
    ).toBeInTheDocument();
  });

  it('빈 목록이면 empty 상태 렌더링', () => {
    render(<CertificationList certifications={[]} />);
    expect(screen.getByText('자격증 없음')).toBeInTheDocument();
  });
});
