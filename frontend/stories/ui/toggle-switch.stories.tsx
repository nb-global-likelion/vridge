import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { ToggleSwitch } from '@/frontend/components/ui/toggle-switch';

const meta = {
  title: '공통/ToggleSwitch',
  component: ToggleSwitch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '불리언 상태를 전환하는 스위치 컴포넌트입니다.',
      },
    },
  },
  args: {
    checked: false,
    onChange: fn(),
  },
  argTypes: {
    onChange: { control: false },
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const InteractiveToggle: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);

    return (
      <ToggleSwitch
        checked={checked}
        onChange={(next) => {
          setChecked(next);
          args.onChange(next);
        }}
      />
    );
  },
};
