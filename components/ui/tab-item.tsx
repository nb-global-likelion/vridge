import Link from 'next/link';

type TabItemProps = {
  label: string;
  isActive: boolean;
  href: string;
};

export function TabItem({ label, isActive, href }: TabItemProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center border-b px-[10px] py-[5px] text-[16px] leading-[1.5] font-medium transition-colors ${
        isActive
          ? 'border-[#ff6000] font-bold text-[#ff6000]'
          : 'border-[#e6e6e6] text-[#333] hover:rounded-[130px] hover:bg-[#ffefe5] hover:text-[#1a1a1a]'
      }`}
    >
      {label}
    </Link>
  );
}
