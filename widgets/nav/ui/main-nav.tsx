'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/use-session';
import { useAuthModal } from '@/features/auth/model/use-auth-modal';
import { LangPicker } from '@/components/ui/lang-picker';
import UserMenu from './user-menu';

const NAV_LINKS = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Announcement', href: '/announcement' },
];

export default function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const { openLogin, openSignup } = useAuthModal();

  return (
    <nav className="flex items-center justify-between bg-white px-[45px] py-[10px] shadow-[0_4px_13px_rgba(0,0,0,0.04)]">
      {/* 로고 */}
      <Link
        href="/jobs"
        className="font-[Oswald] text-[32px] font-semibold tracking-tight"
      >
        VRIDGE<span className="text-brand">.</span>
      </Link>

      {/* 탭 네비게이션 */}
      <div className="flex items-center gap-[50px]">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={[
                'text-[22px] font-bold transition-colors',
                isActive ? 'text-brand' : 'text-[#333] hover:text-brand',
              ].join(' ')}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* 우측 영역 */}
      <div className="flex items-center gap-4">
        <LangPicker
          value="EN"
          onChange={() => {}}
          options={['EN', 'KR', 'VN']}
        />

        {user ? (
          <UserMenu
            name={user.name ?? user.email}
            email={user.email}
            image={user.image}
          />
        ) : (
          <div className="flex items-center gap-0 text-[18px]">
            <button
              type="button"
              onClick={openLogin}
              className="font-medium text-[#333] hover:text-brand"
            >
              Log in
            </button>
            <span className="mx-2 text-[#ccc]">|</span>
            <button
              type="button"
              onClick={openSignup}
              className="font-medium text-[#333] hover:text-brand"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
