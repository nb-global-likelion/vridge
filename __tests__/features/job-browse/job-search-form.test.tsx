import { screen, fireEvent } from '@testing-library/react';
import { JobSearchForm } from '@/features/job-browse/ui/job-search-form';
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

describe('JobSearchForm', () => {
  it('SearchBar를 렌더링한다', () => {
    renderWithI18n(<JobSearchForm />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('initialSearch가 input 초기값으로 반영된다', () => {
    renderWithI18n(<JobSearchForm initialSearch="프론트엔드" />);
    expect(screen.getByRole('textbox')).toHaveValue('프론트엔드');
  });

  it('폼 제출 시 router.push 호출 (search 파라미터 포함)', () => {
    renderWithI18n(<JobSearchForm initialSearch="백엔드" />);

    fireEvent.submit(screen.getByRole('form'));

    expect(mockPush).toHaveBeenCalledWith(
      '/jobs?search=%EB%B0%B1%EC%97%94%EB%93%9C'
    );
  });

  it('빈 검색어 제출 시 search 파라미터 미포함', () => {
    renderWithI18n(<JobSearchForm />);

    fireEvent.submit(screen.getByRole('form'));

    expect(mockPush).toHaveBeenCalledWith('/jobs');
  });

  it('제출 시 familyId, sort 유지 + page 제거', () => {
    mockSearchParams = new URLSearchParams(
      'familyId=engineering&sort=created_desc&page=3'
    );

    renderWithI18n(<JobSearchForm initialSearch="백엔드" />);
    fireEvent.submit(screen.getByRole('form'));

    expect(mockPush).toHaveBeenCalledWith(
      '/jobs?search=%EB%B0%B1%EC%97%94%EB%93%9C&familyId=engineering&sort=created_desc'
    );
  });
});
