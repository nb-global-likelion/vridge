'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { LoginField } from '@/components/ui/login-field';

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  id: string;
};

export function PasswordInput({ id, className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <LoginField
      id={id}
      type={show ? 'text' : 'password'}
      leftIconName="password"
      leftIconAlt="lock"
      className={className}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="shrink-0"
          aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          <Icon name={show ? 'show' : 'hidden'} size={24} />
        </button>
      }
      {...props}
    />
  );
}
