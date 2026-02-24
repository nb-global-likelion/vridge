'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/frontend/hooks/use-session';
import { useAuthModal } from '@/frontend/features/auth/model/use-auth-modal';
import { trackEvent } from '@/frontend/lib/analytics/ga4';
import { LangPicker } from '@/frontend/components/ui/lang-picker';
import { useI18n, serializeLocaleCookie } from '@/shared/i18n/client';
import type { AppLocale } from '@/shared/i18n/types';
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

  function handleOpenLogin() {
    trackEvent('auth_modal_open', {
      locale,
      page_path: pathname,
      modal: 'login',
      entry_point: 'nav',
      is_authenticated: Boolean(user),
      user_role: user ? 'other' : 'unknown',
    });
    openLogin();
  }

  function handleOpenSignup() {
    trackEvent('auth_modal_open', {
      locale,
      page_path: pathname,
      modal: 'signup',
      entry_point: 'nav',
      is_authenticated: Boolean(user),
      user_role: user ? 'other' : 'unknown',
    });
    openSignup();
  }

  return (
    <nav className="flex items-center justify-between p-[20px]">
      <div className="flex items-center gap-[40px]">
        <Link
          href="/jobs"
          className="flex h-[50px] items-center rounded-[80px] bg-white px-[20px] font-[Oswald] text-title leading-none font-semibold tracking-tight shadow-[0_0_15px_rgba(255,149,84,0.2)]"
        >
          VRIDGE<span className="text-brand">.</span>
        </Link>
        <div className="flex h-[50px] items-center gap-[50px] rounded-[80px] bg-white px-[30px] py-[10px] shadow-[0_0_15px_rgba(255,149,84,0.2)]">
          {navLinks.map(({ label, href }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'text-h2 transition-colors',
                  isActive
                    ? 'text-brand'
                    : 'text-text-title-2 hover:text-brand',
                ].join(' ')}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-[40px]">
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
          <div className="flex h-[50px] items-center rounded-[80px] bg-white px-[20px] py-[10px] shadow-[0_0_15px_rgba(255,149,84,0.2)]">
            <button
              type="button"
              onClick={handleOpenLogin}
              className="text-body-1 text-text-title-2 hover:text-brand"
            >
              {t('nav.login')}
            </button>
            <span className="mx-[10px] h-[16px] w-px bg-gray-300" />
            <button
              type="button"
              onClick={handleOpenSignup}
              className="text-body-1 text-text-title-2 hover:text-brand"
            >
              {t('nav.signup')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
