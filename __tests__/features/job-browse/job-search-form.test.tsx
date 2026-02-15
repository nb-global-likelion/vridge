import { render, screen, fireEvent } from '@testing-library/react';
import { JobSearchForm } from '@/features/job-browse/ui/job-search-form';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockPush })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

beforeEach(() => jest.clearAllMocks());

describe('JobSearchForm', () => {
  it('SearchBar를 렌더링한다', () => {
    render(<JobSearchForm />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('initialSearch가 input 초기값으로 반영된다', () => {
    render(<JobSearchForm initialSearch="프론트엔드" />);
    expect(screen.getByRole('textbox')).toHaveValue('프론트엔드');
  });

  it('폼 제출 시 router.push 호출 (search 파라미터 포함)', () => {
    render(<JobSearchForm initialSearch="백엔드" />);

    fireEvent.submit(screen.getByRole('form'));

    expect(mockPush).toHaveBeenCalledWith(
      '/jobs?search=%EB%B0%B1%EC%97%94%EB%93%9C'
    );
  });

  it('빈 검색어 제출 시 search 파라미터 미포함', () => {
    render(<JobSearchForm />);

    fireEvent.submit(screen.getByRole('form'));

    expect(mockPush).toHaveBeenCalledWith('/jobs');
  });
});
