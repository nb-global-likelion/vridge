import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { SectionTitle } from '@/frontend/components/ui/section-title';
import { useI18n } from '@/shared/i18n/client';
import type { MessageKey } from '@/shared/i18n/messages/en';

type LocalizedSectionTitleProps = Omit<
  React.ComponentProps<typeof SectionTitle>,
  'title'
> & {
  titleKey: MessageKey;
};

function LocalizedSectionTitle({
  titleKey,
  ...props
}: LocalizedSectionTitleProps) {
  const { t } = useI18n();

  return <SectionTitle {...props} title={t(titleKey)} />;
}

const meta = {
  title: '공통/SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '섹션 헤더 타이틀 컴포넌트입니다. onAdd를 전달하면 우측에 추가 버튼이 노출됩니다.',
      },
    },
  },
  args: {
    title: '',
  },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  render: () => <LocalizedSectionTitle titleKey="profile.basicProfile" />,
};

export const WithAddAction: Story = {
  args: {
    onAdd: fn(),
  },
  render: (args) => (
    <LocalizedSectionTitle {...args} titleKey="profile.basicProfile" />
  ),
};
