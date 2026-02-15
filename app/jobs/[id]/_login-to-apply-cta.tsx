'use client';

import { useAuthModal } from '@/features/auth/model/use-auth-modal';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/client';

export function LoginToApplyCta() {
  const { openLogin } = useAuthModal();
  const { t } = useI18n();
  return <Button onClick={openLogin}>{t('jobs.loginToApply')}</Button>;
}
