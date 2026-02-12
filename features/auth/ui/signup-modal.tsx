'use client';

import { useState } from 'react';
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
import { signUp } from '@/lib/infrastructure/auth-client';
import { useAuthModal } from '../model/use-auth-modal';

const signupSchema = z
  .object({
    name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
    email: z.string().email('유효한 이메일을 입력하세요'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export function SignupModal() {
  const { isSignupOpen, closeAll, openLogin } = useAuthModal();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    validators: { onSubmit: signupSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            closeAll();
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
        <DialogHeader>
          <DialogTitle>회원가입</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="name">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  autoComplete="name"
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
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
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

          <form.Field name="confirmPassword">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-confirm-password">
                  Confirm Password
                </Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  autoComplete="new-password"
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
                {isSubmitting ? '가입 중...' : 'Sign Up'}
              </Button>
            )}
          </form.Subscribe>

          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={openLogin}
              className="font-medium text-brand hover:underline"
            >
              Log in
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
