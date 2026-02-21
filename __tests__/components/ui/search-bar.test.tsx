import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/frontend/components/ui/search-bar';

describe('SearchBar', () => {
  it('main variant: rounded-[60px] border 스타일', () => {
    render(
      <SearchBar
        variant="main"
        value=""
        onChange={() => {}}
        placeholder="Search"
      />
    );
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveClass('rounded-[60px]');
    expect(input).toHaveClass('border-[#b3b3b3]');
  });

  it('skills variant: bg-[#fbfbfb] 스타일', () => {
    render(
      <SearchBar
        variant="skills"
        value=""
        onChange={() => {}}
        placeholder="Search skills"
      />
    );
    const input = screen.getByPlaceholderText('Search skills');
    expect(input).toHaveClass('bg-[#fbfbfb]');
    expect(input).toHaveClass('rounded-[999px]');
    expect(input).toHaveClass('text-[14px]');
  });

  it('skills variant: search 아이콘 렌더링', () => {
    const { container } = render(
      <SearchBar
        variant="skills"
        value=""
        onChange={() => {}}
        placeholder="Search"
      />
    );
    expect(container.querySelector('img[src*="search"]')).toBeInTheDocument();
  });

  it('placeholder 텍스트 표시', () => {
    render(
      <SearchBar
        variant="main"
        value=""
        onChange={() => {}}
        placeholder="Search jobs"
      />
    );
    expect(screen.getByPlaceholderText('Search jobs')).toBeInTheDocument();
  });

  it('onChange 콜백 호출', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <SearchBar
        variant="main"
        value=""
        onChange={handleChange}
        placeholder="Search"
      />
    );
    await user.type(screen.getByPlaceholderText('Search'), 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('값이 있으면 본문 텍스트 톤을 사용한다', () => {
    render(
      <SearchBar
        variant="skills"
        value="Frontend"
        onChange={() => {}}
        placeholder="Search"
      />
    );

    expect(screen.getByDisplayValue('Frontend')).toHaveClass('text-[#333]');
  });
});
