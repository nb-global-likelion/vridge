'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthModal } from '../model/use-auth-modal';

export function AuthRedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (searchParams.get('auth') === 'required') {
      openLogin();
      router.replace('/jobs');
    }
  }, [searchParams, openLogin, router]);

  return null;
}
