'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/infrastructure/auth-client';
import { useI18n } from '@/lib/i18n/client';

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
      <p className="mb-[40px] text-[30px] leading-[1.5] font-bold text-[#1a1a1a]">
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
                'py-0 text-[26px] leading-[1.5] font-bold transition-colors',
                isActive ? 'text-brand' : 'text-[#666] hover:text-brand',
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
        className="mt-4 text-left text-[18px] leading-[1.5] font-medium text-[#999] transition-colors hover:text-[#333]"
      >
        {t('nav.logout')}
      </button>
    </aside>
  );
}
