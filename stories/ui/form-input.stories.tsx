import type { Meta, StoryObj } from '@storybook/nextjs';
import { FormInput } from '@/components/ui/form-input';

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
    placeholder: '입력해 주세요',
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
    placeholder: 'Small 입력',
  },
};

export const MediumDefault: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium 입력',
  },
};

export const LargeTextarea: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large textarea 입력',
  },
};

export const FilledRequired: Story = {
  args: {
    filled: true,
    required: true,
    value: '이미 입력된 값',
    readOnly: true,
  },
};
