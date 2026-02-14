import { render, screen } from '@testing-library/react';
import { PostingListItem } from '@/entities/job/ui/posting-list-item';

const baseProps = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: '프론트엔드 개발자',
  orgName: 'TechCo',
  jobDisplayNameEn: 'Frontend Engineer',
  employmentType: 'full_time',
  workArrangement: 'remote',
  skills: [
    { skill: { displayNameEn: 'React' } },
    { skill: { displayNameEn: 'TypeScript' } },
  ],
  createdAt: new Date('2025-01-01'),
  status: 'recruiting' as const,
  href: '/jobs/123e4567-e89b-12d3-a456-426614174000',
};

describe('PostingListItem', () => {
  it('제목 렌더링', () => {
    render(<PostingListItem {...baseProps} />);
    expect(screen.getByText('프론트엔드 개발자')).toBeInTheDocument();
  });

  it('회사명 렌더링', () => {
    render(<PostingListItem {...baseProps} />);
    expect(screen.getByText('TechCo')).toBeInTheDocument();
  });

  it('직무명 렌더링', () => {
    render(<PostingListItem {...baseProps} />);
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
  });

  it('스킬 칩 렌더링', () => {
    render(<PostingListItem {...baseProps} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('PostStatus 렌더링', () => {
    render(<PostingListItem {...baseProps} />);
    expect(screen.getByText('Recruiting')).toBeInTheDocument();
  });

  it('Link href 설정', () => {
    render(<PostingListItem {...baseProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', baseProps.href);
  });

  it('컨테이너 스타일: rounded-[20px]', () => {
    render(<PostingListItem {...baseProps} />);
    const link = screen.getByRole('link');
    expect(link.firstChild).toHaveClass('rounded-[20px]');
  });
});
