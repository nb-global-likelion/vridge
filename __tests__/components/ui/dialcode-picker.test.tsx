import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DialcodePicker } from '@/frontend/components/ui/dialcode-picker';

describe('DialcodePicker', () => {
  it('현재 코드 표시', () => {
    render(<DialcodePicker value="+82" onChange={() => {}} />);
    expect(screen.getByText('+82')).toBeInTheDocument();
  });

  it('클릭 시 코드 목록 표시', async () => {
    const user = userEvent.setup();
    render(<DialcodePicker value="+82" onChange={() => {}} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('+84')).toBeInTheDocument();
    expect(screen.getAllByText('+82').length).toBeGreaterThanOrEqual(1);
  });

  it('코드 선택 시 onChange 호출', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<DialcodePicker value="+82" onChange={handleChange} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('+84'));
    expect(handleChange).toHaveBeenCalledWith('+84');
  });

  it('국기 아이콘 렌더링', () => {
    const { container } = render(
      <DialcodePicker value="+82" onChange={() => {}} />
    );
    expect(container.querySelector('img[src*="flag-kr"]')).toBeInTheDocument();
  });

  it('subset 외 코드도 안전하게 표시', () => {
    render(<DialcodePicker value="+999" onChange={() => {}} />);
    expect(screen.getByText('+999')).toBeInTheDocument();
  });
});
