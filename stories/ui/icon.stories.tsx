import type { Meta, StoryObj } from '@storybook/nextjs';
import { Icon } from '@/components/ui/icon';

const ICON_NAMES = [
  'arrow-left',
  'checked',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'close',
  'edit',
  'education',
  'email-at',
  'error',
  'experience',
  'facebook',
  'google',
  'hidden',
  'jobs',
  'location',
  'mail',
  'mobile',
  'password',
  'plus',
  'profile',
  'required',
  'search',
  'show',
  'sorting',
  'status-done',
  'status-recruiting',
  'success',
  'time',
  'unchecked',
  'university',
] as const;

const meta = {
  title: '공통/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'public/icons SVG 에셋을 이름 기반으로 렌더링합니다.',
      },
    },
  },
  args: {
    name: 'search',
    size: 24,
    alt: '아이콘',
  },
  argTypes: {
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SizeVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Icon name="search" size={16} alt="search 16" />
        <span className="text-xs">16</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Icon name="search" size={24} alt="search 24" />
        <span className="text-xs">24</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Icon name="search" size={32} alt="search 32" />
        <span className="text-xs">32</span>
      </div>
    </div>
  ),
};

export const IconGallery: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
      {ICON_NAMES.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-md border p-3"
        >
          <Icon name={name} size={24} alt={name} />
          <span className="text-center text-xs">{name}</span>
        </div>
      ))}
    </div>
  ),
};
