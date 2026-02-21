import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostStatus } from '@/frontend/components/ui/post-status';
import { I18nProvider } from '@/shared/i18n/client';
import { viMessages } from '@/shared/i18n/messages/vi';

const meta = {
  title: '공통/PostStatus',
  component: PostStatus,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <I18nProvider locale="vi" messages={viMessages}>
        <Story />
      </I18nProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '채용 상태(recruiting/done)를 색상과 아이콘으로 표시하며, 기본 라벨은 i18n 번역 키를 사용합니다.',
      },
    },
  },
  args: {
    status: 'recruiting',
    size: 'sm',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['recruiting', 'done'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
} satisfies Meta<typeof PostStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Recruiting: Story = {};

export const Done: Story = {
  args: {
    status: 'done',
  },
};

export const CustomLabel: Story = {
  args: {
    status: 'recruiting',
    label: '긴급 채용',
    size: 'md',
  },
};
