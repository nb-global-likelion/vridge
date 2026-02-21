'use client';

import { useI18n } from '@/shared/i18n/client';

type Url = {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
};

type Props = {
  urls: Url[];
};

export function UrlList({ urls }: Props) {
  const { t } = useI18n();

  if (urls.length === 0) {
    return <p className="text-muted-foreground">{t('profile.empty.urls')}</p>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {urls.map((u) => (
        <li key={u.id}>
          <a
            href={u.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand hover:underline"
          >
            {u.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
