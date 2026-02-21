'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/frontend/lib/analytics/ga4';

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const pathWithQuery = queryString ? `${pathname}?${queryString}` : pathname;
    trackPageView(pathWithQuery, document.title);
  }, [pathname, queryString]);

  return null;
}
