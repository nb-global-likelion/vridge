import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { SectionTitle } from '@/components/ui/section-title';

const meta = {
  title: '공통/SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '섹션 헤더 타이틀 컴포넌트입니다. onAdd를 전달하면 우측에 추가 버튼이 노출됩니다.',
      },
    },
  },
  args: {
    title: '기본 정보',
  },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {};

export const WithAddAction: Story = {
  args: {
    onAdd: fn(),
  },
};
