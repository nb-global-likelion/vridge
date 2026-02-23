import type { Meta, StoryObj } from '@storybook/nextjs';
import { FormInput } from '@/frontend/components/ui/form-input';
import { useI18n } from '@/shared/i18n/client';
import type { MessageKey } from '@/shared/i18n/messages/en';

type LocalizedFormInputProps = React.ComponentProps<typeof FormInput> & {
  placeholderKey?: MessageKey;
  valueKey?: MessageKey;
};

function LocalizedFormInput({
  placeholderKey,
  valueKey,
  ...props
}: LocalizedFormInputProps) {
  const { t } = useI18n();

  return (
    <FormInput
      {...props}
      placeholder={placeholderKey ? t(placeholderKey) : props.placeholder}
      value={valueKey ? t(valueKey) : props.value}
    />
  );
}

const meta = {
  title: '공통/FormInput',
  component: FormInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Figma 입력 필드 스타일(sm/md/lg)을 지원합니다. lg는 textarea로 렌더링됩니다.',
      },
    },
  },
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => (
    <LocalizedFormInput {...args} placeholderKey="form.firstName" />
  ),
};

export const MediumDefault: Story = {
  args: {
    size: 'md',
  },
  render: (args) => (
    <LocalizedFormInput {...args} placeholderKey="form.email" />
  ),
};

export const LargeTextarea: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => (
    <LocalizedFormInput {...args} placeholderKey="form.description" />
  ),
};

export const FilledRequired: Story = {
  args: {
    filled: true,
    required: true,
    readOnly: true,
  },
  render: (args) => (
    <LocalizedFormInput {...args} valueKey="profile.myProfile" />
  ),
};
