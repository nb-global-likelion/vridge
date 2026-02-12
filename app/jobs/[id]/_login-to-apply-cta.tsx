'use client';

import { useAuthModal } from '@/features/auth/model/use-auth-modal';
import { Button } from '@/components/ui/button';

export function LoginToApplyCta() {
  const { openLogin } = useAuthModal();
  return <Button onClick={openLogin}>로그인하여 지원하기</Button>;
}
