import { render, screen } from '@testing-library/react';
import { TabItem } from '@/frontend/components/ui/tab-item';

describe('TabItem', () => {
  it('라벨 텍스트 렌더링', () => {
    render(<TabItem label="Jobs" isActive={false} href="/jobs" />);
    expect(screen.getByText('Jobs')).toBeInTheDocument();
  });

  it('Next.js Link로 렌더링', () => {
    render(<TabItem label="Jobs" isActive={false} href="/jobs" />);
    const link = screen.getByRole('link', { name: 'Jobs' });
    expect(link).toHaveAttribute('href', '/jobs');
  });

  it('비활성 상태: 기본 스타일', () => {
    render(<TabItem label="Jobs" isActive={false} href="/jobs" />);
    const link = screen.getByRole('link', { name: 'Jobs' });
    expect(link).toHaveClass('text-body-2');
    expect(link).toHaveClass('border-gray-100');
    expect(link).not.toHaveClass('text-brand');
  });

  it('활성 상태: brand 색상 + 하단 보더', () => {
    render(<TabItem label="Jobs" isActive={true} href="/jobs" />);
    const link = screen.getByRole('link', { name: 'Jobs' });
    expect(link).toHaveClass('text-brand');
    expect(link).toHaveClass('border-b');
    expect(link).toHaveClass('border-brand');
    expect(link).toHaveClass('font-bold');
    expect(link).toHaveClass('text-body-2');
  });
});
