'use client';

import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  title: string;
};

export function ShareJobButton({ title }: Props) {
  const { t } = useI18n();

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // ignore and continue to clipboard fallback
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // ignore clipboard failure
      }
    }
  };

  return (
    <button
      type="button"
      aria-label={t('jobs.share')}
      className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#f2f2f2] bg-white"
      onClick={() => {
        void handleShare();
      }}
    >
      <Icon name="share" size={30} />
    </button>
  );
}
