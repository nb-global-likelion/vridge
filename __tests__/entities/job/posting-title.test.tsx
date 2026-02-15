import { screen } from '@testing-library/react';
import { PostingTitle } from '@/entities/job/ui/posting-title';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

describe('PostingTitle', () => {
  it('타이틀 렌더링', () => {
    renderWithI18n(
      <PostingTitle
        title="TechCo Frontend Engineer / Full-time / 3+ years"
        status="recruiting"
        createdAt={new Date('2025-01-01')}
      />
    );
    expect(
      screen.getByText('TechCo Frontend Engineer / Full-time / 3+ years')
    ).toBeInTheDocument();
  });

  it('뒤로가기 화살표 렌더링', () => {
    const { container } = renderWithI18n(
      <PostingTitle
        title="Test"
        status="recruiting"
        createdAt={new Date('2025-01-01')}
      />
    );
    expect(
      container.querySelector('img[src*="arrow-left"]')
    ).toBeInTheDocument();
  });

  it('PostStatus 렌더링', () => {
    renderWithI18n(
      <PostingTitle
        title="Test"
        status="done"
        createdAt={new Date('2025-01-01')}
      />
    );
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('타이틀 스타일: text-[30px] font-bold', () => {
    renderWithI18n(
      <PostingTitle
        title="Test Title"
        status="recruiting"
        createdAt={new Date('2025-01-01')}
      />
    );
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('text-[30px]');
    expect(title).toHaveClass('font-bold');
  });
});
