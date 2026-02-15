import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { FormDropdown } from '@/components/ui/form-dropdown';

const OPTIONS = [
  { label: '한국', value: 'kr' },
  { label: '베트남', value: 'vn' },
  { label: '미국', value: 'us' },
];

const meta = {
  title: '공통/FormDropdown',
  component: FormDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '선택형 입력에 사용하는 커스텀 드롭다운입니다. placeholder/선택 상태/옵션 선택 상호작용을 제공합니다.',
      },
    },
  },
  args: {
    options: OPTIONS,
    placeholder: '국가를 선택하세요',
    onChange: fn(),
  },
  argTypes: {
    onChange: { control: false },
  },
} satisfies Meta<typeof FormDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};

export const SelectedValue: Story = {
  args: {
    value: 'vn',
  },
};

export const InteractiveSelection: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div className="w-[280px]">
        <FormDropdown
          {...args}
          value={value}
          onChange={(next) => {
            setValue(next);
            args.onChange(next);
          }}
        />
      </div>
    );
  },
};
