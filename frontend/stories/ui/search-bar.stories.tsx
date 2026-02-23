import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { SearchBar } from '@/frontend/components/ui/search-bar';
import { useI18n } from '@/shared/i18n/client';
import type { MessageKey } from '@/shared/i18n/messages/en';

type LocalizedSearchBarProps = React.ComponentProps<typeof SearchBar> & {
  placeholderKey: MessageKey;
};

function LocalizedSearchBar({
  placeholderKey,
  ...args
}: LocalizedSearchBarProps) {
  const { t } = useI18n();
  const [value, setValue] = useState(args.value);

  return (
    <div className="w-[380px]">
      <SearchBar
        {...args}
        value={value}
        placeholder={t(placeholderKey)}
        onChange={(next) => {
          setValue(next);
          args.onChange(next);
        }}
      />
    </div>
  );
}

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
  render: (args) => (
    <LocalizedSearchBar {...args} placeholderKey="jobs.searchPlaceholder" />
  ),
};

export const Skills: Story = {
  args: {
    variant: 'skills',
  },
  render: (args) => (
    <LocalizedSearchBar
      {...args}
      placeholderKey="form.skillsSearchPlaceholder"
    />
  ),
};
