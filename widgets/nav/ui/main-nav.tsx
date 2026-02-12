'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/use-session';
import { Button } from '@/components/ui/button';
import UserMenu from './user-menu';

const NAV_LINKS = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Announcement', href: '/announcement' },
];

export default function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="flex h-14 items-center justify-between border-b bg-white px-6">
      {/* 로고 */}
      <Link href="/jobs" className="text-lg font-bold tracking-tight">
        VRIDGE
      </Link>

      {/* 탭 네비게이션 */}
      <div className="flex items-center gap-1">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={[
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                isActive
                  ? 'border-brand font-semibold text-brand'
                  : 'border-transparent text-foreground hover:border-border',
              ].join(' ')}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* 우측 영역 */}
      <div className="flex items-center gap-2">
        {/* 언어 선택 스텁 */}
        <Button variant="ghost" size="sm" className="text-sm">
          EN ▾
        </Button>

        {user ? (
          <UserMenu
            name={user.name ?? user.email}
            email={user.email}
            image={user.image}
          />
        ) : (
          <>
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button variant="ghost" size="sm">
              Sign Up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
