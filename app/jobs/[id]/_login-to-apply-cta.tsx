'use client';

import { useAuthModal } from '@/features/auth/model/use-auth-modal';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics/ga4';
import { useI18n } from '@/lib/i18n/client';

export function LoginToApplyCta() {
  const { openLogin } = useAuthModal();
  const { locale, t } = useI18n();

  return (
    <Button
      onClick={() => {
        trackEvent('auth_modal_open', {
          locale,
          modal: 'login',
          entry_point: 'job_detail_apply',
          page_path: '/jobs',
          is_authenticated: false,
          user_role: 'unknown',
        });
        openLogin();
      }}
    >
      {t('jobs.loginToApply')}
    </Button>
  );
}
