import { screen } from '@testing-library/react';
import { FormInput } from '@/components/ui/form-input';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

describe('FormInput', () => {
  it('sm 사이즈: h-[41px]', () => {
    renderWithI18n(<FormInput size="sm" placeholder="Name" />);
    const input = screen.getByPlaceholderText('Name');
    expect(input).toHaveClass('h-[41px]');
  });

  it('md 사이즈 (기본): h-[52px]', () => {
    renderWithI18n(<FormInput placeholder="Email" />);
    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveClass('h-[52px]');
  });

  it('lg 사이즈: textarea 렌더링', () => {
    renderWithI18n(<FormInput size="lg" placeholder="Bio" />);
    const textarea = screen.getByPlaceholderText('Bio');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveClass('h-[130px]');
  });

  it('기본 상태: bg-[#fbfbfb] 배경', () => {
    renderWithI18n(<FormInput placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('bg-[#fbfbfb]');
  });

  it('filled 상태: bg-white + border', () => {
    renderWithI18n(<FormInput placeholder="Test" filled />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('bg-white');
    expect(input).toHaveClass('border-[#b3b3b3]');
  });

  it('모든 사이즈 rounded-[10px]', () => {
    renderWithI18n(<FormInput placeholder="Test" />);
    expect(screen.getByPlaceholderText('Test')).toHaveClass('rounded-[10px]');
  });

  it('required 시 별표 아이콘 렌더링', () => {
    const { container } = renderWithI18n(
      <FormInput placeholder="Test" required />
    );
    expect(container.querySelector('img[src*="required"]')).toBeInTheDocument();
  });

  it('required 아닐 때 별표 아이콘 없음', () => {
    const { container } = renderWithI18n(<FormInput placeholder="Test" />);
    expect(
      container.querySelector('img[src*="required"]')
    ).not.toBeInTheDocument();
  });

  it('file variant 렌더링: plus 아이콘 + 텍스트', () => {
    const { container } = renderWithI18n(
      <FormInput variant="file" placeholder="File Upload" />
    );

    expect(screen.getByText('File Upload')).toBeInTheDocument();
    expect(container.querySelector('img[src*="plus"]')).toBeInTheDocument();
  });

  it('file variant 기본 텍스트는 로케일 메시지를 사용한다', () => {
    renderWithI18n(<FormInput variant="file" />);
    expect(screen.getByText('File Upload')).toBeInTheDocument();
  });
});
