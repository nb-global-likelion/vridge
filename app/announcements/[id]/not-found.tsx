import Link from 'next/link';
import { Button } from '@/frontend/components/ui/button';
import { getServerI18n } from '@/shared/i18n/server';

export default async function AnnouncementNotFound() {
  const { t } = await getServerI18n();

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-3 px-6 py-10 text-center">
      <h1 className="text-h2 font-semibold text-text-title-2">
        {t('announcements.notFound.title')}
      </h1>
      <p className="text-sm text-text-sub-1">
        {t('announcements.notFound.description')}
      </p>
      <Button asChild variant="brand" size="brand-sm">
        <Link href="/announcements">{t('announcements.goList')}</Link>
      </Button>
    </div>
  );
}
