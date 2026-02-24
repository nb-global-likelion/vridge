'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/button';
import { useI18n } from '@/shared/i18n/client';

export default function AnnouncementsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-3 px-6 py-10 text-center">
      <h1 className="text-h2 font-semibold text-text-title-2">
        {t('announcements.error.title')}
      </h1>
      <p className="text-sm text-text-sub-1">
        {t('announcements.error.description')}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="brand-outline"
          size="brand-sm"
          onClick={reset}
        >
          {t('common.actions.retry')}
        </Button>
        <Button asChild variant="brand" size="brand-sm">
          <Link href="/announcements">{t('announcements.goList')}</Link>
        </Button>
      </div>
    </div>
  );
}
