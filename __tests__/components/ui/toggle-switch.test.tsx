import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleSwitch } from '@/components/ui/toggle-switch';

describe('ToggleSwitch', () => {
  it('unchecked 상태: 회색 트랙', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} />);
    const track = screen.getByRole('switch');
    expect(track).toHaveClass('bg-[#e6e6e6]');
  });

  it('checked 상태: 초록색 트랙', () => {
    render(<ToggleSwitch checked={true} onChange={() => {}} />);
    const track = screen.getByRole('switch');
    expect(track).toHaveClass('bg-[#00a600]');
  });

  it('aria-checked 속성 반영', () => {
    const { rerender } = render(
      <ToggleSwitch checked={false} onChange={() => {}} />
    );
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

    rerender(<ToggleSwitch checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('클릭 시 onChange 호출', () => {
    const onChange = jest.fn();
    render(<ToggleSwitch checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('checked 상태에서 클릭 시 false 전달', () => {
    const onChange = jest.fn();
    render(<ToggleSwitch checked={true} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
