import type { Meta, StoryObj } from '@storybook/nextjs';
import { NumberedPagination } from '@/frontend/components/ui/numbered-pagination';

const meta = {
  title: '공통/NumberedPagination',
  component: NumberedPagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '페이지 번호, 말줄임, 이전/다음 화살표를 제공하는 공통 페이지네이션 컴포넌트입니다.',
      },
    },
  },
  args: {
    currentPage: 2,
    totalPages: 5,
    buildHref: (page: number) => `/jobs?page=${page}`,
    prevAriaLabel: '이전 페이지',
    nextAriaLabel: '다음 페이지',
  },
  argTypes: {
    buildHref: { control: false },
  },
} satisfies Meta<typeof NumberedPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const EllipsisCase: Story = {
  args: {
    currentPage: 6,
    totalPages: 12,
  },
};

export const FirstPageDisabledPrev: Story = {
  args: {
    currentPage: 1,
    totalPages: 7,
  },
};

export const LastPageDisabledNext: Story = {
  args: {
    currentPage: 7,
    totalPages: 7,
  },
};
