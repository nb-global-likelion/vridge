'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/frontend/lib/analytics/ga4';
import type { AppLocale } from '@/shared/i18n/types';

type Props = {
  jdId: string;
  locale: AppLocale;
};

export function JobDetailAnalytics({ jdId, locale }: Props) {
  useEffect(() => {
    trackEvent('job_view', {
      locale,
      page_path: `/jobs/${jdId}`,
      jd_id: jdId,
    });
  }, [jdId, locale]);

  return null;
}
