'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/infrastructure/auth-client';
import { useAuthModal } from '../model/use-auth-modal';

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
            router.push('/dashboard/candidate/profile');
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
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
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
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
                          ? (field.state.meta.errors[0] as { message: string })
                              .message
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
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {String(
                        field.state.meta.errors[0] instanceof Object
                          ? (field.state.meta.errors[0] as { message: string })
                              .message
                          : field.state.meta.errors[0]
                      )}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? '로그인 중...' : 'Log in'}
              </Button>
            )}
          </form.Subscribe>

          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{' '}
            <button
              type="button"
              onClick={openSignup}
              className="font-medium text-brand hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
