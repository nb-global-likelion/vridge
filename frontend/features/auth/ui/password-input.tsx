'use client';

import { useState } from 'react';
import { Icon } from '@/frontend/components/ui/icon';
import { LoginField } from '@/frontend/components/ui/login-field';
import { useI18n } from '@/shared/i18n/client';

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  id: string;
};

export function PasswordInput({ id, className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const { t } = useI18n();

  return (
    <LoginField
      id={id}
      type={show ? 'text' : 'password'}
      leftIconName="password"
      leftIconAlt={t('auth.password.lockAlt')}
      className={className}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="shrink-0"
          aria-label={
            show ? t('auth.password.hideAria') : t('auth.password.showAria')
          }
        >
          <Icon name={show ? 'show' : 'hidden'} size={24} />
        </button>
      }
      {...props}
    />
  );
}
