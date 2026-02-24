'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/backend/infrastructure/auth-client';
import { useI18n } from '@/shared/i18n/client';

const SIDEBAR_LINKS = [
  { labelKey: 'nav.myProfile', href: '/candidate/profile' },
  { labelKey: 'nav.myJobs', href: '/candidate/applications' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  return (
    <aside className="flex w-[220px] shrink-0 flex-col px-5 py-8">
      <p className="mb-[40px] text-title text-text-title-2">
        {t('nav.myPage')}
      </p>
      <nav className="flex flex-1 flex-col gap-[10px]">
        {SIDEBAR_LINKS.map(({ labelKey, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={[
                'py-0 text-h1 transition-colors',
                isActive ? 'text-brand' : 'text-text-sub-1 hover:text-brand',
              ].join(' ')}
            >
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() =>
          signOut({ fetchOptions: { onSuccess: () => router.push('/jobs') } })
        }
        className="mt-4 text-left text-body-1 text-text-info transition-colors hover:text-text-body-1"
      >
        {t('nav.logout')}
      </button>
    </aside>
  );
}
