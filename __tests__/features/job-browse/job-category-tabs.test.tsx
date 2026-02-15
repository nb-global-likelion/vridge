import { render, screen } from '@testing-library/react';
import { JobCategoryTabs } from '@/features/job-browse/ui/job-category-tabs';

const families = [
  { id: 'engineering', displayNameEn: 'Engineering' },
  { id: 'design', displayNameEn: 'Design' },
];

describe('JobCategoryTabs', () => {
  it('"All" 탭이 항상 렌더링된다', () => {
    render(<JobCategoryTabs families={families} />);
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('패밀리 이름이 모두 렌더링된다', () => {
    render(<JobCategoryTabs families={families} />);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('activeFamilyId 미전달 시 "All" 탭이 활성 상태', () => {
    render(<JobCategoryTabs families={families} />);
    const allTab = screen.getByText('All').closest('a');
    expect(allTab?.className).toContain('ff6000');
  });

  it('activeFamilyId 전달 시 해당 탭이 활성 상태', () => {
    render(<JobCategoryTabs families={families} activeFamilyId="design" />);
    const designTab = screen.getByText('Design').closest('a');
    expect(designTab?.className).toContain('ff6000');

    const allTab = screen.getByText('All').closest('a');
    expect(allTab?.className).not.toContain('ff6000');
  });

  it('탭 href에 familyId가 포함된다', () => {
    render(<JobCategoryTabs families={families} />);
    const engLink = screen.getByText('Engineering').closest('a');
    expect(engLink).toHaveAttribute('href', '/jobs?familyId=engineering');
  });

  it('"All" 탭 href는 /jobs', () => {
    render(<JobCategoryTabs families={families} />);
    const allLink = screen.getByText('All').closest('a');
    expect(allLink).toHaveAttribute('href', '/jobs');
  });
});
