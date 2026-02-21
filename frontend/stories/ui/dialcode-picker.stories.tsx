import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { DialcodePicker } from '@/frontend/components/ui/dialcode-picker';

const meta = {
  title: '공통/DialcodePicker',
  component: DialcodePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '국가 전화번호 코드를 선택하는 드롭다운 컴포넌트입니다. 현재 코드 표시와 코드 변경을 지원합니다.',
      },
    },
  },
  args: {
    value: '+84',
    onChange: fn(),
  },
  argTypes: {
    onChange: { control: false },
  },
} satisfies Meta<typeof DialcodePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultCode: Story = {};

export const InteractiveCodeSelection: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <DialcodePicker
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange(next);
        }}
      />
    );
  },
};
