import type { Meta, StoryObj } from '@storybook/nextjs';
import { TabItem } from '@/frontend/components/ui/tab-item';
import { useI18n } from '@/shared/i18n/client';
import type { MessageKey } from '@/shared/i18n/messages/en';

type LocalizedTabItemProps = Omit<
  React.ComponentProps<typeof TabItem>,
  'label'
> & {
  labelKey: MessageKey;
};

function LocalizedTabItem({ labelKey, ...props }: LocalizedTabItemProps) {
  const { t } = useI18n();

  return <TabItem {...props} label={t(labelKey)} />;
}

const meta = {
  title: '공통/TabItem',
  component: TabItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '잡 패밀리/탭 내비게이션에서 사용하는 링크형 탭 아이템입니다.',
      },
    },
  },
  args: {
    label: '',
    href: '/jobs?family=frontend',
    isActive: false,
  },
} satisfies Meta<typeof TabItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
  render: (args) => <LocalizedTabItem {...args} labelKey="profile.skills" />,
};

export const Active: Story = {
  args: {
    isActive: true,
  },
  render: (args) => <LocalizedTabItem {...args} labelKey="profile.skills" />,
};
