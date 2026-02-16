'use client';

import { useEffect, useState } from 'react';
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
import { signIn, signUp } from '@/lib/infrastructure/auth-client';
import { useAuthModal } from '../model/use-auth-modal';
import { PasswordInput } from './password-input';

type Step = 'method' | 'form' | 'success';

const signupSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});

export function SignupModal() {
  const { isSignupOpen, closeAll, openLogin } = useAuthModal();
  const [step, setStep] = useState<Step>('method');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignupOpen) {
      setTimeout(() => {
        setStep('method');
        setPrivacyChecked(false);
        setServerError(null);
      });
    }
  }, [isSignupOpen]);

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: signupSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      await signUp.email({
        name: value.email.split('@')[0],
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => setStep('success'),
          onError: (ctx) => {
            setServerError(
              (ctx.error as { message?: string })?.message ??
                '회원가입에 실패했습니다'
            );
          },
        },
      });
    },
  });

  return (
    <Dialog open={isSignupOpen} onOpenChange={(open) => !open && closeAll()}>
      <DialogContent
        showCloseButton={false}
        className="w-[712px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[20px] border-0 bg-white p-0 shadow-[0_0_15px_7px_rgba(255,149,84,0.07)]"
      >
        <div className="flex flex-col items-center gap-10 px-5 pt-5 pb-20">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-[#666]">
              Have an account?{' '}
              <button
                type="button"
                onClick={openLogin}
                className="underline underline-offset-2"
              >
                Log in
              </button>
            </p>
            <button
              type="button"
              onClick={closeAll}
              aria-label="Close signup modal"
              className="rounded-sm p-1 text-[#1a1a1a] hover:bg-[#f5f5f5]"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          <div className="flex w-full max-w-[520px] flex-col items-center gap-10">
            <DialogDescription className="sr-only">
              Create an account or continue with a social login provider.
            </DialogDescription>
            {step === 'method' && (
              <>
                <DialogTitle className="text-2xl font-bold text-[#1f1f1f]">
                  Sign Up
                </DialogTitle>

                <div className="flex w-full flex-col gap-5">
                  <SocialLs
                    provider="google"
                    actionLabel="Sign up"
                    onClick={() =>
                      signIn.social({
                        provider: 'google',
                        callbackURL: '/candidate/profile',
                      })
                    }
                  />

                  <SocialLs
                    provider="facebook"
                    actionLabel="Sign up"
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

                <SocialLs
                  provider="email"
                  actionLabel="Sign up"
                  onClick={() => setStep('form')}
                />
              </>
            )}

            {step === 'form' && (
              <>
                <DialogTitle className="text-2xl font-bold text-[#1f1f1f]">
                  Sign Up
                </DialogTitle>

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
                        <Label htmlFor="signup-email" className="sr-only">
                          Email
                        </Label>
                        <LoginField
                          id="signup-email"
                          type="email"
                          autoComplete="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="E-mail"
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
                        <Label htmlFor="signup-password" className="sr-only">
                          Password
                        </Label>
                        <PasswordInput
                          id="signup-password"
                          autoComplete="new-password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Password"
                        />
                        <p
                          className={`text-xs ${
                            field.state.value.length >= 8
                              ? 'text-green-600'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {field.state.value.length >= 8 ? '✓' : '✗'} 8자 이상
                        </p>
                      </div>
                    )}
                  </form.Field>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={privacyChecked}
                      onChange={(e) => setPrivacyChecked(e.target.checked)}
                    />
                    개인정보 처리방침에 동의합니다
                  </label>

                  {serverError && (
                    <p className="text-sm text-destructive">{serverError}</p>
                  )}

                  <form.Subscribe selector={(s) => s.isSubmitting}>
                    {(isSubmitting) => (
                      <Button
                        type="submit"
                        variant={
                          isSubmitting || !privacyChecked
                            ? 'brand-disabled'
                            : 'brand'
                        }
                        size="brand-lg"
                        disabled={isSubmitting || !privacyChecked}
                        className="w-full"
                      >
                        {isSubmitting ? '가입 중...' : 'Sign Up'}
                      </Button>
                    )}
                  </form.Subscribe>
                </form>
              </>
            )}

            {step === 'success' && (
              <div className="flex w-full flex-col items-center gap-4 py-6">
                <DialogTitle className="text-lg font-semibold">
                  가입 완료!
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  회원가입이 완료되었습니다.
                </p>
                <Button
                  onClick={closeAll}
                  variant="brand"
                  size="brand-lg"
                  className="w-full"
                >
                  닫기
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
