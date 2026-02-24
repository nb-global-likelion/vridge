'use client';

import Link from 'next/link';
import { Button } from '@/frontend/components/ui/button';
import { useI18n } from '@/shared/i18n/client';

type Props = {
  onAccept: () => void;
  onReject: () => void;
  privacyPolicyUrl?: string;
};

export function ConsentBanner({ onAccept, onReject, privacyPolicyUrl }: Props) {
  const { t } = useI18n();

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 rounded-xl border border-gray-100 bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[760px] space-y-2">
          <p className="text-sm font-semibold text-gray-950">
            {t('analytics.consent.title')}
          </p>
          <p className="text-sm text-gray-700">
            {t('analytics.consent.message')}
          </p>
          {privacyPolicyUrl ? (
            <Link
              href={privacyPolicyUrl}
              className="text-sm text-brand underline underline-offset-2"
            >
              {t('analytics.consent.privacyLink')}
            </Link>
          ) : (
            <p className="text-xs text-gray-600">
              {t('analytics.consent.privacyText')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 self-end">
          <Button variant="outline" onClick={onReject}>
            {t('analytics.consent.reject')}
          </Button>
          <Button variant="brand" onClick={onAccept}>
            {t('analytics.consent.accept')}
          </Button>
        </div>
      </div>
    </div>
  );
}
