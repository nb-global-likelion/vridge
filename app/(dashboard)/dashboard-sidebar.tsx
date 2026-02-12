'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/infrastructure/auth-client';

const SIDEBAR_LINKS = [
  { label: 'My Profile', href: '/dashboard/candidate/profile' },
  { label: 'My Jobs', href: '/dashboard/candidate/applications' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r px-6 py-8">
      <p className="mb-6 text-2xl font-bold">MY Page</p>
      <nav className="flex flex-1 flex-col gap-1">
        {SIDEBAR_LINKS.map(({ label, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={[
                'py-1 text-base transition-colors',
                isActive
                  ? 'font-semibold text-brand'
                  : 'text-foreground hover:text-brand',
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
        className="mt-4 text-left text-base text-muted-foreground transition-colors hover:text-foreground"
      >
        Logout
      </button>
    </aside>
  );
}
