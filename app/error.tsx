'use client';

import { useEffect } from 'react';
import { Button } from '@/frontend/components/ui/button';
import { useI18n } from '@/shared/i18n/client';

export default function GlobalError({
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
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-h2 font-semibold text-text-title-2">
        {t('global.error.title')}
      </h1>
      <p className="text-sm text-text-sub-1">{t('global.error.description')}</p>
      <Button type="button" variant="brand" size="brand-md" onClick={reset}>
        {t('global.error.retry')}
      </Button>
    </div>
  );
}
