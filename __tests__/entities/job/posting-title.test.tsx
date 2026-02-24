import { screen } from '@testing-library/react';
import { PostingTitle } from '@/frontend/entities/job/ui/posting-title';
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

  it('옵션 메타 전달 시 조합 타이틀 렌더링', () => {
    renderWithI18n(
      <PostingTitle
        title="fallback title"
        company="TechCo"
        jobDisplayName="Frontend Engineer"
        workArrangement="Remote"
        minYearsExperience={3}
        status="recruiting"
        createdAt={new Date('2025-01-01')}
      />
    );
    expect(
      screen.getByText('TechCo / Frontend Engineer / Remote / 3+ years')
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

  it('backHref 전달 시 뒤로가기 링크를 렌더링한다', () => {
    renderWithI18n(
      <PostingTitle
        title="Test"
        status="recruiting"
        createdAt={new Date('2025-01-01')}
        backHref="/jobs"
      />
    );
    expect(screen.getByRole('link', { name: 'Back to jobs' })).toHaveAttribute(
      'href',
      '/jobs'
    );
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

  it('타이틀 스타일: text-title', () => {
    renderWithI18n(
      <PostingTitle
        title="Test Title"
        status="recruiting"
        createdAt={new Date('2025-01-01')}
      />
    );
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('text-title');
  });
});
