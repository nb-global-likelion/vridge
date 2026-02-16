'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/infrastructure/auth-client';

const SIDEBAR_LINKS = [
  { label: 'My Profile', href: '/candidate/profile' },
  { label: 'My Jobs', href: '/candidate/applications' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex w-[220px] shrink-0 flex-col px-5 py-8">
      <p className="mb-[40px] text-[30px] leading-[1.5] font-bold text-[#1a1a1a]">
        MY Page
      </p>
      <nav className="flex flex-1 flex-col gap-[10px]">
        {SIDEBAR_LINKS.map(({ label, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={[
                'py-0 text-[26px] leading-[1.5] font-bold transition-colors',
                isActive ? 'text-brand' : 'text-[#666] hover:text-brand',
              ].join(' ')}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() =>
          signOut({ fetchOptions: { onSuccess: () => router.push('/jobs') } })
        }
        className="mt-4 text-left text-[18px] leading-[1.5] font-medium text-[#999] transition-colors hover:text-[#333]"
      >
        Logout
      </button>
    </aside>
  );
}
