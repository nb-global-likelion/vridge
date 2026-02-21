import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn, userEvent, within } from 'storybook/test';
import { LangPicker } from '@/frontend/components/ui/lang-picker';
import type { AppLocale } from '@/shared/i18n/types';

const OPTIONS: ReadonlyArray<{ value: AppLocale; label: string }> = [
  { value: 'vi', label: 'VN' },
  { value: 'en', label: 'EN' },
  { value: 'ko', label: 'KR' },
];

const meta = {
  title: '공통/LangPicker',
  component: LangPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '언어 코드를 표시하고 드롭다운에서 로케일을 선택하는 공통 언어 선택기입니다.',
      },
    },
  },
  args: {
    value: 'vi',
    options: OPTIONS,
    onChange: fn(),
    ariaLabel: '언어 선택',
  },
  argTypes: {
    onChange: { control: false },
  },
} satisfies Meta<typeof LangPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultSelection: Story = {};

export const OptionList: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '언어 선택' }));
  },
};

export const InteractiveLocaleChange: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <LangPicker
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
