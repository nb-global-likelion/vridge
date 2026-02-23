import Link from 'next/link';
import type { MouseEventHandler } from 'react';

type TabItemProps = {
  label: string;
  isActive: boolean;
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function TabItem({ label, isActive, href, onClick }: TabItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center border-b px-[10px] py-[5px] text-[16px] leading-[1.5] font-medium transition-colors ${
        isActive
          ? 'border-brand font-bold text-brand'
          : 'border-gray-100 text-[#333] hover:rounded-[130px] hover:bg-brand-sub hover:text-[#1a1a1a]'
      }`}
    >
      {label}
    </Link>
  );
}
