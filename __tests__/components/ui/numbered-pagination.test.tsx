import { render, screen } from '@testing-library/react';
import { NumberedPagination } from '@/components/ui/numbered-pagination';

function buildHref(page: number) {
  return `/jobs?page=${page}`;
}

describe('NumberedPagination', () => {
  it('totalPages <= 1이면 null 반환', () => {
    const { container } = render(
      <NumberedPagination
        currentPage={1}
        totalPages={1}
        buildHref={buildHref}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('모든 페이지 번호 렌더링 (5페이지 이하)', () => {
    render(
      <NumberedPagination
        currentPage={1}
        totalPages={5}
        buildHref={buildHref}
      />
    );
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('현재 페이지 활성 스타일: bg-[#ffefe5] text-[#ff6000]', () => {
    render(
      <NumberedPagination
        currentPage={3}
        totalPages={5}
        buildHref={buildHref}
      />
    );
    const active = screen.getByText('3');
    expect(active).toHaveClass('bg-[#ffefe5]');
    expect(active).toHaveClass('text-[#ff6000]');
    expect(active).toHaveClass('h-[24px]');
    expect(active).toHaveClass('w-[24px]');
  });

  it('비활성 페이지: Link로 렌더링', () => {
    render(
      <NumberedPagination
        currentPage={1}
        totalPages={5}
        buildHref={buildHref}
      />
    );
    const link = screen.getByText('2').closest('a');
    expect(link).toHaveAttribute('href', '/jobs?page=2');
  });

  it('많은 페이지에서 ellipsis 표시', () => {
    render(
      <NumberedPagination
        currentPage={5}
        totalPages={10}
        buildHref={buildHref}
      />
    );
    const dots = screen.getAllByText('···');
    expect(dots.length).toBeGreaterThanOrEqual(1);
  });

  it('좌우 화살표 렌더링', () => {
    const { container } = render(
      <NumberedPagination
        currentPage={3}
        totalPages={5}
        buildHref={buildHref}
      />
    );
    const arrows = container.querySelectorAll('img[src*="chevron"]');
    expect(arrows.length).toBe(2);
  });

  it('첫 페이지: 왼쪽 화살표 비활성', () => {
    render(
      <NumberedPagination
        currentPage={1}
        totalPages={5}
        buildHref={buildHref}
      />
    );
    const prevLink = screen.getByLabelText('이전 페이지');
    expect(prevLink.tagName).not.toBe('A');
  });

  it('마지막 페이지: 오른쪽 화살표 비활성', () => {
    render(
      <NumberedPagination
        currentPage={5}
        totalPages={5}
        buildHref={buildHref}
      />
    );
    const nextLink = screen.getByLabelText('다음 페이지');
    expect(nextLink.tagName).not.toBe('A');
  });
});
