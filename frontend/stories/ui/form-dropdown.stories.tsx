import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { FormDropdown } from '@/frontend/components/ui/form-dropdown';
import { useI18n } from '@/shared/i18n/client';

function getLocalizedOptions(
  t: ReturnType<typeof useI18n>['t']
): React.ComponentProps<typeof FormDropdown>['options'] {
  return [
    { label: t('locale.koName'), value: 'ko' },
    { label: t('locale.viName'), value: 'vi' },
    { label: t('locale.enName'), value: 'en' },
  ];
}

function LocalizedFormDropdown(
  args: React.ComponentProps<typeof FormDropdown>
) {
  const { t } = useI18n();

  return (
    <FormDropdown
      {...args}
      options={getLocalizedOptions(t)}
      placeholder={t('form.select')}
    />
  );
}

function LocalizedInteractiveFormDropdown(
  args: React.ComponentProps<typeof FormDropdown>
) {
  const { t } = useI18n();
  const [value, setValue] = useState(args.value);

  return (
    <div className="w-[280px]">
      <FormDropdown
        {...args}
        value={value}
        options={getLocalizedOptions(t)}
        placeholder={t('form.select')}
        onChange={(next) => {
          setValue(next);
          args.onChange(next);
        }}
      />
    </div>
  );
}

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
    options: [],
    placeholder: '',
    onChange: fn(),
  },
  argTypes: {
    onChange: { control: false },
    options: { control: false },
    placeholder: { control: false },
  },
} satisfies Meta<typeof FormDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {
  render: (args) => <LocalizedFormDropdown {...args} />,
};

export const SelectedValue: Story = {
  args: {
    value: 'vi',
  },
  render: (args) => <LocalizedFormDropdown {...args} />,
};

export const InteractiveSelection: Story = {
  render: (args) => <LocalizedInteractiveFormDropdown {...args} />,
};
