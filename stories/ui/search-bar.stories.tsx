import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { SearchBar } from '@/components/ui/search-bar';

const meta = {
  title: '공통/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '메인 검색과 스킬 검색에서 공용으로 사용하는 검색 입력 컴포넌트입니다.',
      },
    },
  },
  args: {
    variant: 'main',
    value: '',
    placeholder: '검색어를 입력하세요',
    onChange: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['main', 'skills'],
    },
    onChange: { control: false },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    variant: 'main',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div className="w-[380px]">
        <SearchBar
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

export const Skills: Story = {
  args: {
    variant: 'skills',
    placeholder: '스킬 검색',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div className="w-[380px]">
        <SearchBar
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
