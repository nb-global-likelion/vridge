import Link from 'next/link';
import { Button } from '@/frontend/components/ui/button';
import { getServerI18n } from '@/shared/i18n/server';

export default async function GlobalNotFound() {
  const { t } = await getServerI18n();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-h2 font-semibold text-text-title-2">
        {t('global.notFound.title')}
      </h1>
      <p className="text-sm text-text-sub-1">
        {t('global.notFound.description')}
      </p>
      <Button asChild variant="brand" size="brand-md">
        <Link href="/jobs">{t('global.notFound.goJobs')}</Link>
      </Button>
    </div>
  );
}
