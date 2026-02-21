import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SectionTitle } from '@/frontend/components/ui/section-title';

describe('SectionTitle', () => {
  it('제목 텍스트 렌더링', () => {
    render(<SectionTitle title="Experience" />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  it('제목 스타일: text-[22px] font-bold', () => {
    render(<SectionTitle title="Experience" />);
    const title = screen.getByText('Experience');
    expect(title).toHaveClass('text-[22px]');
    expect(title).toHaveClass('font-bold');
  });

  it('하단 구분선 렌더링', () => {
    const { container } = render(<SectionTitle title="Experience" />);
    const divider = container.querySelector('.h-px');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('bg-[#b3b3b3]');
  });

  it('onAdd 없을 때 추가 버튼 미표시', () => {
    render(<SectionTitle title="Experience" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('onAdd 있을 때 추가 버튼 표시', () => {
    render(<SectionTitle title="Experience" onAdd={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('size-[32px]');
  });

  it('추가 버튼 클릭 시 onAdd 호출', async () => {
    const user = userEvent.setup();
    const handleAdd = jest.fn();
    render(<SectionTitle title="Experience" onAdd={handleAdd} />);
    await user.click(screen.getByRole('button'));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
