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
    expect(link).toHaveClass('text-[16px]');
    expect(link).toHaveClass('border-[#e6e6e6]');
    expect(link).not.toHaveClass('text-[#ff6000]');
  });

  it('활성 상태: brand 색상 + 하단 보더', () => {
    render(<TabItem label="Jobs" isActive={true} href="/jobs" />);
    const link = screen.getByRole('link', { name: 'Jobs' });
    expect(link).toHaveClass('text-[#ff6000]');
    expect(link).toHaveClass('border-b');
    expect(link).toHaveClass('border-[#ff6000]');
    expect(link).toHaveClass('font-bold');
    expect(link).toHaveClass('text-[16px]');
  });
});
