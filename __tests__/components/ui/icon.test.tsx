import { render, screen } from '@testing-library/react';
import { Icon } from '@/frontend/components/ui/icon';

describe('Icon', () => {
  it('src가 /icons/{name}.svg 형식으로 렌더링', () => {
    render(<Icon name="jobs" alt="jobs" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/icons/jobs.svg');
  });

  it('기본 size는 24', () => {
    render(<Icon name="jobs" alt="jobs" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('width', '24');
    expect(img).toHaveAttribute('height', '24');
  });

  it('size prop 적용', () => {
    render(<Icon name="jobs" alt="jobs" size={32} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('width', '32');
    expect(img).toHaveAttribute('height', '32');
  });

  it('className prop 적용', () => {
    render(<Icon name="jobs" alt="jobs" className="custom-class" />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('custom-class');
  });

  it('alt prop 적용', () => {
    render(<Icon name="jobs" alt="채용 아이콘" />);
    expect(screen.getByAltText('채용 아이콘')).toBeInTheDocument();
  });

  it('alt 미지정 시 빈 문자열 (장식용)', () => {
    const { container } = render(<Icon name="jobs" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', '');
  });
});
