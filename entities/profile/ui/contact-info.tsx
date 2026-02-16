'use client';

import { useI18n } from '@/lib/i18n/client';

type Props = {
  phoneNumber?: string | null;
  email?: string | null;
};

export function ContactInfo({ phoneNumber, email }: Props) {
  const { t } = useI18n();

  return (
    <dl className="flex flex-col gap-1 text-sm">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">{t('profile.contact.phone')}</dt>
        <dd>{phoneNumber ?? t('profile.contact.notProvided')}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground">{t('profile.contact.email')}</dt>
        <dd>{email ?? t('profile.contact.notProvided')}</dd>
      </div>
    </dl>
  );
}
