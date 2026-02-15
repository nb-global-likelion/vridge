import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { DatePicker } from '@/components/ui/date-picker';

const FULL_VALUE = new Date(Date.UTC(2025, 8, 15));
const MONTH_VALUE = new Date(Date.UTC(2025, 8, 1));

const meta = {
  title: '공통/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '날짜(full) 또는 월(month)을 선택하는 커스텀 피커입니다. 클릭 시 팝업에서 값을 선택합니다.',
      },
    },
  },
  args: {
    type: 'full',
    onChange: fn(),
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['full', 'month'],
    },
    onChange: { control: false },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullPlaceholder: Story = {
  args: {
    type: 'full',
  },
  render: (args) => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <DatePicker
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

export const FullValue: Story = {
  args: {
    type: 'full',
    value: FULL_VALUE,
  },
};

export const MonthPlaceholder: Story = {
  args: {
    type: 'month',
  },
  render: (args) => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <DatePicker
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

export const MonthValue: Story = {
  args: {
    type: 'month',
    value: MONTH_VALUE,
  },
};

export const InteractiveSelect: Story = {
  args: {
    type: 'full',
  },
  render: (args) => {
    const [value, setValue] = useState<Date | undefined>(FULL_VALUE);

    return (
      <DatePicker
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
