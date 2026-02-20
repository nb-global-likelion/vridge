import { screen } from '@testing-library/react';
import { JobCategoryTabs } from '@/features/job-browse/ui/job-category-tabs';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

const families = [
  { id: 'engineering', displayName: 'Engineering' },
  { id: 'design', displayName: 'Design' },
];

describe('JobCategoryTabs', () => {
  it('"All" 탭이 항상 렌더링된다', () => {
    renderWithI18n(<JobCategoryTabs families={families} query={{}} />);
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('패밀리 이름이 모두 렌더링된다', () => {
    renderWithI18n(<JobCategoryTabs families={families} query={{}} />);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('activeFamilyId 미전달 시 "All" 탭이 활성 상태', () => {
    renderWithI18n(<JobCategoryTabs families={families} query={{}} />);
    const allTab = screen.getByText('All').closest('a');
    expect(allTab?.className).toContain('ff6000');
  });

  it('activeFamilyId 전달 시 해당 탭이 활성 상태', () => {
    renderWithI18n(
      <JobCategoryTabs
        families={families}
        activeFamilyId="design"
        query={{ search: 'react', sort: 'created_desc', page: 3 }}
      />
    );
    const designTab = screen.getByText('Design').closest('a');
    expect(designTab?.className).toContain('ff6000');

    const allTab = screen.getByText('All').closest('a');
    expect(allTab?.className).not.toContain('ff6000');
  });

  it('탭 href에 familyId가 포함된다', () => {
    renderWithI18n(
      <JobCategoryTabs
        families={families}
        query={{ search: 'react', sort: 'created_desc', page: 3 }}
      />
    );
    const engLink = screen.getByText('Engineering').closest('a');
    expect(engLink).toHaveAttribute(
      'href',
      '/jobs?search=react&familyId=engineering&sort=created_desc'
    );
  });

  it('"All" 탭 href는 search/sort 유지 + familyId/page 제거', () => {
    renderWithI18n(
      <JobCategoryTabs
        families={families}
        query={{
          search: 'react',
          familyId: 'design',
          sort: 'created_desc',
          page: 3,
        }}
      />
    );
    const allLink = screen.getByText('All').closest('a');
    expect(allLink).toHaveAttribute(
      'href',
      '/jobs?search=react&sort=created_desc'
    );
  });
});
