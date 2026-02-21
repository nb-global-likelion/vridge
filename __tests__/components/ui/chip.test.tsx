import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from '@/frontend/components/ui/chip';

describe('Chip', () => {
  describe('variant="displayed"', () => {
    it('기본 스타일: 흰 배경 + 회색 테두리', () => {
      render(<Chip label="React" variant="displayed" />);
      const chip = screen.getByText('React');
      expect(chip.closest('[data-slot="chip"]')).toHaveClass(
        'border-[#b3b3b3]'
      );
      expect(chip.closest('[data-slot="chip"]')).toHaveClass('bg-white');
      expect(chip.closest('[data-slot="chip"]')).toHaveClass('text-[#666]');
    });

    it('close 아이콘 없음', () => {
      const { container } = render(<Chip label="React" variant="displayed" />);
      expect(
        container.querySelector('img[src*="close"]')
      ).not.toBeInTheDocument();
    });
  });

  describe('variant="searched"', () => {
    it('close 아이콘 표시', () => {
      const { container } = render(
        <Chip label="React" variant="searched" onRemove={() => {}} />
      );
      expect(container.querySelector('img[src*="close"]')).toBeInTheDocument();
      expect(
        screen.getByText('React').closest('[data-slot="chip"]')
      ).toHaveClass('gap-[10px]');
    });

    it('onRemove 콜백 호출', async () => {
      const user = userEvent.setup();
      const handleRemove = jest.fn();
      render(<Chip label="React" variant="searched" onRemove={handleRemove} />);
      await user.click(screen.getByRole('button'));
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('variant="selected"', () => {
    it('오렌지 테두리', () => {
      render(<Chip label="React" variant="selected" />);
      const chip = screen.getByText('React').closest('[data-slot="chip"]');
      expect(chip).toHaveClass('border-[#ff904c]');
    });

    it('체크 아이콘 표시', () => {
      const { container } = render(<Chip label="React" variant="selected" />);
      expect(
        container.querySelector('img[src*="checked"]')
      ).toBeInTheDocument();
      expect(
        screen.getByText('React').closest('[data-slot="chip"]')
      ).toHaveClass('gap-[10px]');
    });

    it('onSelect 콜백 호출', async () => {
      const user = userEvent.setup();
      const handleSelect = jest.fn();
      render(<Chip label="React" variant="selected" onSelect={handleSelect} />);
      await user.click(
        screen.getByText('React').closest('[data-slot="chip"]')!
      );
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('sizes', () => {
    it('sm: 작은 사이즈', () => {
      render(<Chip label="React" variant="displayed" size="sm" />);
      const chip = screen.getByText('React').closest('[data-slot="chip"]');
      expect(chip).toHaveClass('border-[0.5px]');
      expect(chip).toHaveClass('px-[8px]');
      expect(chip).toHaveClass('py-[6px]');
      expect(chip).toHaveClass('text-[14px]');
      expect(chip).toHaveClass('text-[#666]');
    });

    it('md: 중간 사이즈', () => {
      render(<Chip label="React" variant="displayed" size="md" />);
      const chip = screen.getByText('React').closest('[data-slot="chip"]');
      expect(chip).toHaveClass('border');
      expect(chip).toHaveClass('px-[10px]');
      expect(chip).toHaveClass('py-[8px]');
      expect(chip).toHaveClass('text-[16px]');
      expect(chip).toHaveClass('text-[#4c4c4c]');
    });
  });
});
