import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from '@/components/ui/date-picker';

describe('DatePicker', () => {
  it('full 타입 placeholder: DD.MM.YYYY', () => {
    render(<DatePicker type="full" onChange={() => {}} />);
    expect(screen.getByText('DD.MM.YYYY')).toBeInTheDocument();
  });

  it('month 타입 placeholder: MM.YYYY', () => {
    render(<DatePicker type="month" onChange={() => {}} />);
    expect(screen.getByText('MM.YYYY')).toBeInTheDocument();
  });

  it('트리거 기본 스타일: bg-[#fbfbfb] rounded-[10px]', () => {
    render(<DatePicker onChange={() => {}} />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('bg-[#fbfbfb]');
    expect(trigger).toHaveClass('rounded-[10px]');
  });

  it('값이 있을 때 filled 스타일: bg-white + border', () => {
    render(
      <DatePicker value={new Date(Date.UTC(2024, 5, 15))} onChange={() => {}} />
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('bg-white');
    expect(trigger).toHaveClass('border-[#b3b3b3]');
  });

  it('값이 있을 때 날짜 표시', () => {
    render(
      <DatePicker
        type="full"
        value={new Date(Date.UTC(2024, 5, 15))}
        onChange={() => {}}
      />
    );
    expect(screen.getByText('15.06.2024')).toBeInTheDocument();
  });

  it('month 타입 값 표시', () => {
    render(
      <DatePicker
        type="month"
        value={new Date(Date.UTC(2024, 5, 1))}
        onChange={() => {}}
      />
    );
    expect(screen.getByText('06.2024')).toBeInTheDocument();
  });

  it('클릭 시 팝업 열림', async () => {
    const user = userEvent.setup();
    render(<DatePicker onChange={() => {}} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('required=true일 때 required 아이콘 렌더링', () => {
    const { container } = render(<DatePicker required onChange={() => {}} />);
    expect(container.querySelector('img[src*="required"]')).toBeInTheDocument();
  });

  it('open 상태에서 월 컬럼은 영어 월 이름을 렌더링', async () => {
    const user = userEvent.setup();
    render(<DatePicker onChange={() => {}} />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('February')).toBeInTheDocument();
  });

  it('값 선택 후 Select 클릭 시 onChange 호출', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<DatePicker type="month" onChange={handleChange} />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button', { name: 'February' }));
    await user.click(screen.getByRole('button', { name: '1999' }));
    await user.click(screen.getByRole('button', { name: 'Select' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    const changedDate = handleChange.mock.calls[0][0] as Date;
    expect(changedDate.getUTCMonth()).toBe(1);
    expect(changedDate.getUTCFullYear()).toBe(1999);
  });
});
