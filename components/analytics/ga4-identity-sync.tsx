'use client';

import { useEffect } from 'react';
import { useSession } from '@/hooks/use-session';
import { setUserId } from '@/lib/analytics/ga4';

export function Ga4IdentitySync() {
  const { data: session } = useSession();

  const userId =
    session?.user && typeof session.user.id === 'string'
      ? session.user.id
      : null;

  useEffect(() => {
    setUserId(userId);
  }, [userId]);

  return null;
}
