import { render, screen } from '@testing-library/react';
import { SummaryCard } from '@/entities/job/ui/summary-card';

const baseProps = {
  jobDisplayNameEn: 'Frontend Engineer',
  employmentType: 'full_time',
  workArrangement: 'remote',
  skills: [
    { skill: { displayNameEn: 'React' } },
    { skill: { displayNameEn: 'TypeScript' } },
  ],
};

describe('SummaryCard', () => {
  it('직무명 렌더링', () => {
    render(<SummaryCard {...baseProps} />);
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
  });

  it('스킬 칩 렌더링', () => {
    render(<SummaryCard {...baseProps} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('Apply Now 버튼 렌더링', () => {
    render(<SummaryCard {...baseProps} />);
    expect(
      screen.getByRole('button', { name: 'Apply Now' })
    ).toBeInTheDocument();
  });

  it('cta 전달 시 기본 Apply Now 대신 커스텀 CTA 렌더링', () => {
    render(<SummaryCard {...baseProps} cta={<button>커스텀 CTA</button>} />);
    expect(screen.getByText('커스텀 CTA')).toBeInTheDocument();
    expect(screen.queryByText('Apply Now')).not.toBeInTheDocument();
  });

  it('컨테이너 스타일: w-[300px] rounded-[20px]', () => {
    const { container } = render(<SummaryCard {...baseProps} />);
    const card = container.firstChild;
    expect(card).toHaveClass('w-[300px]');
    expect(card).toHaveClass('rounded-[20px]');
  });
});
