import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { Chip } from '@/components/ui/chip';

const meta = {
  title: '공통/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '검색/선택 상태를 표현하는 칩 컴포넌트입니다. searched는 제거, selected는 선택 콜백을 지원합니다.',
      },
    },
  },
  args: {
    label: 'TypeScript',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['displayed', 'searched', 'selected'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Displayed: Story = {
  args: {
    variant: 'displayed',
  },
};

export const SearchedRemovable: Story = {
  args: {
    variant: 'searched',
    onRemove: fn(),
  },
};

export const SelectedSelectable: Story = {
  args: {
    variant: 'selected',
    onSelect: fn(),
  },
};

export const SizeVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Chip label="Small Chip" size="sm" variant="displayed" />
      <Chip label="Medium Chip" size="md" variant="displayed" />
    </div>
  ),
};
