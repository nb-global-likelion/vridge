'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/hooks/use-session';
import { useAuthModal } from '@/features/auth/model/use-auth-modal';
import { LangPicker } from '@/components/ui/lang-picker';
import { useI18n, serializeLocaleCookie } from '@/lib/i18n/client';
import type { AppLocale } from '@/lib/i18n/types';
import UserMenu from './user-menu';

export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const { openLogin, openSignup } = useAuthModal();
  const { locale, t } = useI18n();

  const navLinks = [
    { label: t('nav.jobs'), href: '/jobs' },
    { label: t('nav.announcements'), href: '/announcements' },
  ];

  const languageOptions = [
    { value: 'en', label: t('locale.en') },
    { value: 'ko', label: t('locale.ko') },
    { value: 'vi', label: t('locale.vi') },
  ] as const;

  function handleLocaleChange(nextLocale: AppLocale) {
    document.cookie = serializeLocaleCookie(nextLocale);
    router.refresh();
  }

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
        {navLinks.map(({ label, href }) => {
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
          value={locale}
          onChange={handleLocaleChange}
          options={languageOptions}
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
              {t('nav.login')}
            </button>
            <span className="mx-2 text-[#ccc]">|</span>
            <button
              type="button"
              onClick={openSignup}
              className="font-medium text-[#333] hover:text-brand"
            >
              {t('nav.signup')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
