import { render, screen } from '@testing-library/react';
import { Button } from '@/frontend/components/ui/button';

describe('Button brand variants', () => {
  describe('variant="brand"', () => {
    it('brand 배경 + 흰색 텍스트', () => {
      render(<Button variant="brand">Apply</Button>);
      const btn = screen.getByRole('button', { name: 'Apply' });
      expect(btn).toHaveClass('bg-brand');
      expect(btn).toHaveClass('text-white');
      expect(btn).toHaveClass('rounded-[60px]');
    });
  });

  describe('variant="brand-outline"', () => {
    it('brand 테두리 + brand 텍스트', () => {
      render(<Button variant="brand-outline">Cancel</Button>);
      const btn = screen.getByRole('button', { name: 'Cancel' });
      expect(btn).toHaveClass('border-brand');
      expect(btn).toHaveClass('text-brand');
      expect(btn).toHaveClass('bg-white');
      expect(btn).toHaveClass('rounded-[60px]');
    });
  });

  describe('variant="brand-disabled"', () => {
    it('회색 배경 + 흰색 텍스트 + cursor-not-allowed', () => {
      render(<Button variant="brand-disabled">Disabled</Button>);
      const btn = screen.getByRole('button', { name: 'Disabled' });
      expect(btn).toHaveClass('bg-gray-200');
      expect(btn).toHaveClass('text-white');
      expect(btn).toHaveClass('cursor-not-allowed');
      expect(btn).toHaveClass('rounded-[60px]');
    });
  });

  describe('brand sizes', () => {
    it('brand-sm: h-[34px] px-[10px] py-[5px] body-3 토큰 gap-[5px]', () => {
      render(
        <Button variant="brand" size="brand-sm">
          SM
        </Button>
      );
      const btn = screen.getByRole('button', { name: 'SM' });
      expect(btn).toHaveClass('h-[34px]');
      expect(btn).toHaveClass('px-[10px]');
      expect(btn).toHaveClass('py-[5px]');
      expect(btn).toHaveClass('text-body-3');
      expect(btn).toHaveClass('gap-[5px]');
    });

    it('brand-md: h-[45px] px-[20px] py-[5px] body-3 토큰 gap-[5px]', () => {
      render(
        <Button variant="brand" size="brand-md">
          MD
        </Button>
      );
      const btn = screen.getByRole('button', { name: 'MD' });
      expect(btn).toHaveClass('h-[45px]');
      expect(btn).toHaveClass('px-[20px]');
      expect(btn).toHaveClass('py-[5px]');
      expect(btn).toHaveClass('text-body-3');
      expect(btn).toHaveClass('gap-[5px]');
    });

    it('brand-lg: h-[54px] px-[40px] py-[15px] body-2 토큰 font-bold gap-[5px]', () => {
      render(
        <Button variant="brand" size="brand-lg">
          LG
        </Button>
      );
      const btn = screen.getByRole('button', { name: 'LG' });
      expect(btn).toHaveClass('h-[54px]');
      expect(btn).toHaveClass('px-[40px]');
      expect(btn).toHaveClass('py-[15px]');
      expect(btn).toHaveClass('text-body-2');
      expect(btn).toHaveClass('font-bold');
      expect(btn).toHaveClass('gap-[5px]');
    });
  });
});
