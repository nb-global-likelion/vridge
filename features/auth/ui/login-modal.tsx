'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoginField } from '@/components/ui/login-field';
import { SocialLs } from '@/components/ui/social-ls';
import { signIn } from '@/lib/infrastructure/auth-client';
import { useAuthModal } from '../model/use-auth-modal';
import { PasswordInput } from './password-input';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});

export function LoginModal() {
  const { isLoginOpen, closeAll, openSignup } = useAuthModal();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      await signIn.email({
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            closeAll();
            router.push('/candidate/profile');
          },
          onError: (ctx) => {
            setServerError(
              (ctx.error as { message?: string })?.message ??
                '로그인에 실패했습니다'
            );
          },
        },
      });
    },
  });

  return (
    <Dialog open={isLoginOpen} onOpenChange={(open) => !open && closeAll()}>
      <DialogContent
        showCloseButton={false}
        className="w-[712px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[20px] border-0 bg-white p-0 shadow-[0_0_15px_7px_rgba(255,149,84,0.07)]"
      >
        <div className="flex flex-col items-center gap-10 px-5 pt-5 pb-20">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-[#666]">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={openSignup}
                className="underline underline-offset-2"
              >
                Sign up
              </button>
            </p>
            <button
              type="button"
              onClick={closeAll}
              aria-label="Close login modal"
              className="rounded-sm p-1 text-[#1a1a1a] hover:bg-[#f5f5f5]"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          <div className="flex w-full max-w-[520px] flex-col items-center gap-10">
            <DialogTitle className="text-2xl font-bold text-[#1f1f1f]">
              Login
            </DialogTitle>
            <DialogDescription className="sr-only">
              Log in to access your account.
            </DialogDescription>

            <div className="flex w-full flex-col gap-5">
              <SocialLs
                provider="google"
                actionLabel="Log in"
                onClick={() =>
                  signIn.social({
                    provider: 'google',
                    callbackURL: '/candidate/profile',
                  })
                }
              />
              <SocialLs
                provider="facebook"
                actionLabel="Log in"
                onClick={() =>
                  signIn.social({
                    provider: 'facebook',
                    callbackURL: '/candidate/profile',
                  })
                }
              />
            </div>

            <div className="flex w-full items-center gap-2.5 overflow-hidden">
              <div className="h-px flex-1 bg-[#b3b3b3]" />
              <span className="text-sm font-medium text-[#999]">or</span>
              <div className="h-px flex-1 bg-[#b3b3b3]" />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="flex w-full flex-col gap-5"
            >
              <form.Field name="email">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="login-email" className="sr-only">
                      Email
                    </Label>
                    <LoginField
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Vridge1234@gmail.com"
                      leftIconName="mail"
                      leftIconAlt="mail"
                      filled={field.state.value.length > 0}
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-destructive">
                          {String(
                            field.state.meta.errors[0] instanceof Object
                              ? (
                                  field.state.meta.errors[0] as {
                                    message: string;
                                  }
                                ).message
                              : field.state.meta.errors[0]
                          )}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="login-password" className="sr-only">
                      Password
                    </Label>
                    <PasswordInput
                      id="login-password"
                      autoComplete="current-password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Password"
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-destructive">
                          {String(
                            field.state.meta.errors[0] instanceof Object
                              ? (
                                  field.state.meta.errors[0] as {
                                    message: string;
                                  }
                                ).message
                              : field.state.meta.errors[0]
                          )}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              <button
                type="button"
                className="self-end text-right text-sm font-medium text-[#666] hover:underline"
              >
                Forgot password?
              </button>

              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}

              <form.Subscribe
                selector={(s) => ({
                  isSubmitting: s.isSubmitting,
                  email: s.values.email,
                  password: s.values.password,
                })}
              >
                {({ isSubmitting, email, password }) => {
                  const disabled = isSubmitting || !email || !password;
                  return (
                    <Button
                      type="submit"
                      variant={disabled ? 'brand-disabled' : 'brand'}
                      size="brand-lg"
                      disabled={disabled}
                      className="w-full"
                    >
                      {isSubmitting ? '로그인 중...' : 'Continue'}
                    </Button>
                  );
                }}
              </form.Subscribe>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
