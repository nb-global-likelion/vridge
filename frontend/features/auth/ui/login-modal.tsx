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
} from '@/frontend/components/ui/dialog';
import { Label } from '@/frontend/components/ui/label';
import { Button } from '@/frontend/components/ui/button';
import { Icon } from '@/frontend/components/ui/icon';
import { LoginField } from '@/frontend/components/ui/login-field';
import { SocialLs } from '@/frontend/components/ui/social-ls';
import { trackEvent } from '@/frontend/lib/analytics/ga4';
import { useI18n } from '@/shared/i18n/client';
import { signIn } from '@/backend/infrastructure/auth-client';
import { cn } from '@/frontend/lib/utils';
import { useAuthModal } from '../model/use-auth-modal';
import { PasswordInput } from './password-input';

function getFirstFieldError(errors: unknown[]) {
  if (errors.length === 0) {
    return null;
  }

  const firstError = errors[0];
  if (typeof firstError === 'string') {
    return firstError;
  }

  if (
    typeof firstError === 'object' &&
    firstError !== null &&
    'message' in firstError
  ) {
    return String(firstError.message);
  }

  return String(firstError);
}

export function LoginModal() {
  const { isLoginOpen, closeAll, openSignup } = useAuthModal();
  const router = useRouter();
  const { locale, t } = useI18n();
  const [serverError, setServerError] = useState<string | null>(null);
  const pagePath =
    typeof window !== 'undefined' ? window.location.pathname : undefined;
  const loginSchema = z.object({
    email: z.string().email(t('auth.validation.email')),
    password: z.string().min(8, t('auth.validation.passwordMin')),
  });

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      trackEvent('login_submit', {
        locale,
        page_path: pagePath,
        method: 'email',
        entry_point: 'other',
        is_authenticated: false,
        user_role: 'unknown',
      });
      await signIn.email({
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            trackEvent('login_success', {
              locale,
              page_path: pagePath,
              method: 'email',
              entry_point: 'other',
              is_authenticated: true,
              user_role: 'candidate',
            });
            closeAll();
            router.push('/candidate/profile');
          },
          onError: (ctx) => {
            trackEvent('login_error', {
              locale,
              page_path: pagePath,
              method: 'email',
              entry_point: 'other',
              is_authenticated: false,
              user_role: 'unknown',
              error_code: 'login_failed',
            });
            setServerError(
              (ctx.error as { message?: string })?.message ??
                t('auth.login.invalidCredentials')
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
              {t('auth.login.noAccount')}{' '}
              <button
                type="button"
                onClick={() => {
                  trackEvent('auth_modal_open', {
                    locale,
                    page_path: pagePath,
                    modal: 'signup',
                    entry_point: 'auth_modal_switch',
                    is_authenticated: false,
                    user_role: 'unknown',
                  });
                  openSignup();
                }}
                className="underline underline-offset-2"
              >
                {t('auth.login.signupLink')}
              </button>
            </p>
            <button
              type="button"
              onClick={closeAll}
              aria-label={t('auth.login.closeAria')}
              className="rounded-sm p-1 text-[#1a1a1a] hover:bg-[#f5f5f5]"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          <div className="flex w-full max-w-[520px] flex-col items-center gap-10">
            <DialogTitle className="text-[26px] leading-[1.5] font-bold text-[#313131]">
              {t('auth.login.title')}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t('auth.login.description')}
            </DialogDescription>

            <div className="flex w-full flex-col gap-5">
              <SocialLs
                provider="google"
                label={t('auth.login.withGoogle')}
                onClick={() => {
                  trackEvent('login_submit', {
                    locale,
                    page_path: pagePath,
                    method: 'google',
                    entry_point: 'other',
                    is_authenticated: false,
                    user_role: 'unknown',
                  });
                  signIn.social({
                    provider: 'google',
                    callbackURL: '/candidate/profile',
                  });
                }}
              />
              <SocialLs
                provider="facebook"
                label={t('auth.login.withFacebook')}
                onClick={() => {
                  trackEvent('login_submit', {
                    locale,
                    page_path: pagePath,
                    method: 'facebook',
                    entry_point: 'other',
                    is_authenticated: false,
                    user_role: 'unknown',
                  });
                  signIn.social({
                    provider: 'facebook',
                    callbackURL: '/candidate/profile',
                  });
                }}
              />
            </div>

            <div className="flex w-full items-center gap-2.5 overflow-hidden">
              <div className="h-px flex-1 bg-[#b3b3b3]" />
              <span className="text-sm font-medium text-[#999]">
                {t('common.or')}
              </span>
              <div className="h-px flex-1 bg-[#b3b3b3]" />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="flex w-full flex-col"
            >
              <div className="flex w-full flex-col gap-5">
                <form.Field name="email">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="login-email" className="sr-only">
                        {t('auth.login.emailPlaceholder')}
                      </Label>
                      <LoginField
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          if (serverError) {
                            setServerError(null);
                          }
                        }}
                        onBlur={field.handleBlur}
                        placeholder={t('auth.login.emailPlaceholder')}
                        leftIconName="mail"
                        leftIconAlt={t('auth.icon.mailAlt')}
                        filled={field.state.value.length > 0}
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-xs text-destructive">
                            {getFirstFieldError(field.state.meta.errors)}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <div
                      className={cn(
                        'flex flex-col',
                        serverError ? 'gap-[5px]' : 'gap-5'
                      )}
                    >
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="login-password" className="sr-only">
                          {t('auth.login.passwordPlaceholder')}
                        </Label>
                        <PasswordInput
                          id="login-password"
                          autoComplete="current-password"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            if (serverError) {
                              setServerError(null);
                            }
                          }}
                          onBlur={field.handleBlur}
                          placeholder={t('auth.login.passwordPlaceholder')}
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <p className="text-xs text-destructive">
                              {getFirstFieldError(field.state.meta.errors)}
                            </p>
                          )}
                      </div>
                      {serverError && (
                        <p className="flex items-center text-sm leading-[1.5] font-medium text-[#e50000]">
                          <Icon
                            name="error"
                            size={24}
                            alt={t('auth.icon.errorAlt')}
                          />
                          {serverError}
                        </p>
                      )}
                      <button
                        type="button"
                        className="text-right text-sm font-medium text-[#666] hover:underline"
                      >
                        {t('auth.login.forgotPassword')}
                      </button>
                    </div>
                  )}
                </form.Field>
              </div>

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
                      className="mt-10 w-full"
                    >
                      {isSubmitting
                        ? t('auth.login.submitting')
                        : t('auth.login.submit')}
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
