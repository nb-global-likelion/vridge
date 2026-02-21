import { fireEvent, screen } from '@testing-library/react';
import { JobSortControl } from '@/frontend/features/job-browse/ui/job-sort-control';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

const mockPush = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockPush })),
  useSearchParams: jest.fn(() => mockSearchParams),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockSearchParams = new URLSearchParams();
});

describe('JobSortControl', () => {
  it('정렬 컨트롤을 렌더링한다', () => {
    renderWithI18n(<JobSortControl />);
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Sort by:' })
    ).toBeInTheDocument();
  });

  it('compact raw select 스타일을 유지한다', () => {
    renderWithI18n(<JobSortControl />);
    const select = screen.getByRole('combobox', { name: 'Sort by:' });
    expect(select).toHaveClass('appearance-none');
  });

  it('sort 파라미터 없으면 기본값 updated_desc 선택', () => {
    renderWithI18n(<JobSortControl />);
    const select = screen.getByRole('combobox', { name: 'Sort by:' });
    expect(select).toHaveValue('updated_desc');
  });

  it('created_desc 선택 시 search/familyId 유지 + page 제거', () => {
    mockSearchParams = new URLSearchParams(
      'search=react&familyId=engineering&page=3'
    );

    renderWithI18n(<JobSortControl />);
    const select = screen.getByRole('combobox', { name: 'Sort by:' });
    fireEvent.change(select, { target: { value: 'created_desc' } });

    expect(mockPush).toHaveBeenCalledWith(
      '/jobs?search=react&familyId=engineering&sort=created_desc'
    );
  });

  it('updated_desc 선택 시 sort/page 제거', () => {
    mockSearchParams = new URLSearchParams(
      'search=react&familyId=engineering&sort=created_desc&page=2'
    );

    renderWithI18n(<JobSortControl />);
    const select = screen.getByRole('combobox', { name: 'Sort by:' });
    fireEvent.change(select, { target: { value: 'updated_desc' } });

    expect(mockPush).toHaveBeenCalledWith(
      '/jobs?search=react&familyId=engineering'
    );
  });
});
