import { screen } from '@testing-library/react';
import { PostStatus } from '@/frontend/components/ui/post-status';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

describe('PostStatus', () => {
  it('recruiting 상태: 초록색 텍스트', () => {
    renderWithI18n(<PostStatus status="recruiting" />);
    const text = screen.getByText('Recruiting');
    expect(text).toHaveClass('text-[#00a600]');
    expect(text.parentElement).toHaveClass('gap-[2px]');
  });

  it('done 상태: 빨간색 텍스트', () => {
    renderWithI18n(<PostStatus status="done" />);
    const text = screen.getByText('Done');
    expect(text).toHaveClass('text-[#e50000]');
  });

  it('recruiting 아이콘 렌더링', () => {
    const { container } = renderWithI18n(<PostStatus status="recruiting" />);
    const icon = container.querySelector('img');
    expect(icon).toHaveAttribute('src', '/icons/status-recruiting.svg');
  });

  it('done 아이콘 렌더링', () => {
    const { container } = renderWithI18n(<PostStatus status="done" />);
    const icon = container.querySelector('img');
    expect(icon).toHaveAttribute('src', '/icons/status-done.svg');
  });

  it('sm 사이즈: text-[12px]', () => {
    renderWithI18n(<PostStatus status="recruiting" size="sm" />);
    const text = screen.getByText('Recruiting');
    expect(text).toHaveClass('text-[12px]');
  });

  it('md 사이즈: text-[14px]', () => {
    renderWithI18n(<PostStatus status="recruiting" size="md" />);
    const text = screen.getByText('Recruiting');
    expect(text).toHaveClass('text-[14px]');
  });

  it('커스텀 label 적용', () => {
    renderWithI18n(<PostStatus status="recruiting" label="Open to Work" />);
    expect(screen.getByText('Open to Work')).toBeInTheDocument();
  });
});
