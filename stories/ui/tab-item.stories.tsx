import type { Meta, StoryObj } from '@storybook/nextjs';
import { TabItem } from '@/components/ui/tab-item';

const meta = {
  title: '공통/TabItem',
  component: TabItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '잡 패밀리/탭 내비게이션에서 사용하는 링크형 탭 아이템입니다.',
      },
    },
  },
  args: {
    label: '프론트엔드',
    href: '/jobs?family=frontend',
    isActive: false,
  },
} satisfies Meta<typeof TabItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {};

export const Active: Story = {
  args: {
    isActive: true,
  },
};
