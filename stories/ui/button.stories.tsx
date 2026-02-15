import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { Button } from '@/components/ui/button';

const meta = {
  title: '공통/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Prompt 20 브랜드 버튼 변형(brand/brand-outline/brand-disabled)과 브랜드 사이즈를 제공합니다.',
      },
    },
  },
  args: {
    children: '버튼',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['brand', 'brand-outline', 'brand-disabled'],
    },
    size: {
      control: 'select',
      options: ['brand-sm', 'brand-md', 'brand-lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = {
  args: {
    variant: 'brand',
    size: 'brand-md',
    children: '지원하기',
  },
};

export const BrandOutline: Story = {
  args: {
    variant: 'brand-outline',
    size: 'brand-md',
    children: '자세히 보기',
  },
};

export const BrandDisabled: Story = {
  args: {
    variant: 'brand-disabled',
    size: 'brand-md',
    children: '비활성 버튼',
    disabled: true,
  },
};

export const BrandSizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Button variant="brand" size="brand-sm">
        브랜드 Small
      </Button>
      <Button variant="brand" size="brand-md">
        브랜드 Medium
      </Button>
      <Button variant="brand" size="brand-lg">
        브랜드 Large
      </Button>
    </div>
  ),
};
