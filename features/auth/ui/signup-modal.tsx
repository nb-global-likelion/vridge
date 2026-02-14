'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

  // 모달 닫힐 때 step 1으로 리셋
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
          onSuccess: () => {
            setStep('success');
          },
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
      <DialogContent className="sm:max-w-sm">
        {step === 'method' && (
          <>
            <DialogHeader>
              <DialogTitle>회원가입</DialogTitle>
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={openLogin}
                  className="font-medium text-brand hover:underline"
                >
                  Log in
                </button>
              </p>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                type="button"
                className="w-full gap-2"
                onClick={() =>
                  signIn.social({
                    provider: 'google',
                    callbackURL: '/candidate/profile',
                  })
                }
              >
                <Image src="/icons/google.svg" alt="" width={20} height={20} />
                Sign up with Google
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full gap-2"
                onClick={() =>
                  signIn.social({
                    provider: 'facebook',
                    callbackURL: '/candidate/profile',
                  })
                }
              >
                <Image
                  src="/icons/facebook.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                Sign up with Facebook
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full gap-2"
                onClick={() => setStep('form')}
              >
                <Image
                  src="/icons/email-at.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                Sign up with Email
              </Button>
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle>이메일로 가입</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="flex flex-col gap-4"
            >
              <form.Field name="email">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
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
                    <Label htmlFor="signup-password">Password</Label>
                    <PasswordInput
                      id="signup-password"
                      autoComplete="new-password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
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
          <div className="flex flex-col items-center gap-4 py-6">
            <h2 className="text-lg font-semibold">가입 완료!</h2>
            <p className="text-sm text-muted-foreground">
              회원가입이 완료되었습니다.
            </p>
            <Button onClick={closeAll} className="w-full">
              닫기
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
