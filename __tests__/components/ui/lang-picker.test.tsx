import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LangPicker } from '@/components/ui/lang-picker';

describe('LangPicker', () => {
  const options = [
    { value: 'en', label: 'EN' },
    { value: 'ko', label: 'KR' },
    { value: 'vi', label: 'VN' },
  ] as const;

  it('현재 값 표시', () => {
    render(<LangPicker value="en" onChange={() => {}} options={options} />);
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('chevron 아이콘 렌더링', () => {
    const { container } = render(
      <LangPicker value="en" onChange={() => {}} options={options} />
    );
    expect(
      container.querySelector('img[src*="chevron-down"]')
    ).toBeInTheDocument();
  });

  it('클릭 시 옵션 표시', async () => {
    const user = userEvent.setup();
    render(<LangPicker value="en" onChange={() => {}} options={options} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('KR')).toBeInTheDocument();
    expect(screen.getByText('VN')).toBeInTheDocument();
  });

  it('옵션 선택 시 onChange 호출', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<LangPicker value="en" onChange={handleChange} options={options} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('KR'));
    expect(handleChange).toHaveBeenCalledWith('ko');
  });
});
