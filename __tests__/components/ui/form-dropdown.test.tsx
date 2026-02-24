import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormDropdown } from '@/frontend/components/ui/form-dropdown';

const OPTIONS = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
];

describe('FormDropdown', () => {
  it('placeholder 텍스트 렌더링', () => {
    render(
      <FormDropdown
        options={OPTIONS}
        placeholder="Select"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('기본 배경: bg-bg', () => {
    render(
      <FormDropdown
        options={OPTIONS}
        placeholder="Select"
        onChange={() => {}}
      />
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('bg-bg');
  });

  it('클릭 시 옵션 목록 표시', async () => {
    const user = userEvent.setup();
    render(
      <FormDropdown
        options={OPTIONS}
        placeholder="Select"
        onChange={() => {}}
      />
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('Angular')).toBeInTheDocument();
  });

  it('옵션 선택 시 onChange 호출', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <FormDropdown
        options={OPTIONS}
        placeholder="Select"
        onChange={handleChange}
      />
    );
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Vue'));
    expect(handleChange).toHaveBeenCalledWith('vue');
  });

  it('선택된 값 표시: bg-white + border', () => {
    render(
      <FormDropdown
        options={OPTIONS}
        value="react"
        placeholder="Select"
        onChange={() => {}}
      />
    );
    const trigger = screen.getByRole('button');
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(trigger).toHaveClass('bg-white');
    expect(trigger).toHaveClass('border-gray-300');
  });

  it('chevron-down 아이콘 렌더링', () => {
    const { container } = render(
      <FormDropdown
        options={OPTIONS}
        placeholder="Select"
        onChange={() => {}}
      />
    );
    expect(
      container.querySelector('img[src*="chevron-down"]')
    ).toBeInTheDocument();
  });

  it('open 상태에서 chevron-up 아이콘 렌더링', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FormDropdown
        options={OPTIONS}
        placeholder="Select"
        onChange={() => {}}
      />
    );

    await user.click(screen.getByRole('button'));
    expect(
      container.querySelector('img[src*="chevron-up"]')
    ).toBeInTheDocument();
  });

  it('required=true일 때 required 아이콘 렌더링', () => {
    const { container } = render(
      <FormDropdown
        options={OPTIONS}
        placeholder="Select"
        required
        onChange={() => {}}
      />
    );

    expect(container.querySelector('img[src*="required"]')).toBeInTheDocument();
  });

  it('드롭다운 메뉴 hover 클래스: brand-sub + brand text', async () => {
    const user = userEvent.setup();
    render(
      <FormDropdown
        options={OPTIONS}
        placeholder="Select"
        onChange={() => {}}
      />
    );

    await user.click(screen.getByRole('button'));
    const option = screen.getByRole('button', { name: 'React' });

    expect(option).toHaveClass('hover:bg-brand-sub');
    expect(option).toHaveClass('hover:text-brand');
  });
});
