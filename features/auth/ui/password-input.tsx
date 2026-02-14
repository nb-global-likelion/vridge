'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  id: string;
};

export function PasswordInput({ id, className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn(
        'flex h-[60px] items-center gap-2.5 rounded-[10px] border border-[#b3b3b3] bg-white px-5',
        className
      )}
    >
      <Image
        src="/icons/password.svg"
        alt="lock"
        width={24}
        height={24}
        className="shrink-0"
      />
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className="flex-1 bg-transparent text-lg outline-none placeholder:text-[#999]"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="shrink-0"
        aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'}
      >
        <Image
          src={show ? '/icons/hidden.svg' : '/icons/show.svg'}
          alt=""
          width={24}
          height={24}
        />
      </button>
    </div>
  );
}
