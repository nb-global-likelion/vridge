'use client';

import { useEffect, useState } from 'react';
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
import { signIn, signUp } from '@/backend/infrastructure/auth-client';
import { cn } from '@/frontend/lib/utils';
import { useAuthModal } from '../model/use-auth-modal';
import { PasswordInput } from './password-input';

type Step = 'method' | 'form' | 'success';

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

function isDuplicateEmailError(message?: string) {
  if (!message) {
    return false;
  }

  const normalized = message.toLowerCase();
  const emailMentioned = /mail|email|e-mail/.test(normalized);
  const duplicateHint = /already|exist|duplicate|same|used|중복|이미|đã/.test(
    normalized
  );

  return emailMentioned && duplicateHint;
}

export function SignupModal() {
  const { isSignupOpen, closeAll, openLogin } = useAuthModal();
  const { locale, t } = useI18n();
  const [step, setStep] = useState<Step>('method');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const pagePath =
    typeof window !== 'undefined' ? window.location.pathname : undefined;
  const signupSchema = z.object({
    email: z.string().email(t('auth.validation.email')),
    password: z.string().min(8, t('auth.validation.passwordMin')),
  });

  useEffect(() => {
    if (!isSignupOpen) {
      setTimeout(() => {
        setStep('method');
        setPrivacyChecked(false);
        setEmailError(null);
        setFormError(null);
      });
    }
  }, [isSignupOpen]);

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: signupSchema },
    onSubmit: async ({ value }) => {
      setEmailError(null);
      setFormError(null);
      trackEvent('signup_start', {
        locale,
        page_path: pagePath,
        method: 'email',
        entry_point: 'other',
        is_authenticated: false,
        user_role: 'unknown',
      });
      await signUp.email({
        name: value.email.split('@')[0],
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            trackEvent('signup_success', {
              locale,
              page_path: pagePath,
              method: 'email',
              entry_point: 'other',
              is_authenticated: true,
              user_role: 'candidate',
            });
            setStep('success');
          },
          onError: (ctx) => {
            const errorMessage = (ctx.error as { message?: string })?.message;

            if (isDuplicateEmailError(errorMessage)) {
              trackEvent('signup_error', {
                locale,
                page_path: pagePath,
                method: 'email',
                entry_point: 'other',
                is_authenticated: false,
                user_role: 'unknown',
                error_code: 'duplicate_email',
              });
              setEmailError(t('auth.signup.duplicateEmail'));
              return;
            }

            trackEvent('signup_error', {
              locale,
              page_path: pagePath,
              method: 'email',
              entry_point: 'other',
              is_authenticated: false,
              user_role: 'unknown',
              error_code: 'signup_failed',
            });
            setFormError(errorMessage ?? t('auth.signup.failed'));
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
        <div
          className={cn(
            'flex flex-col items-center px-5',
            step === 'success' ? 'pt-20 pb-20' : 'gap-10 pt-5 pb-20'
          )}
        >
          {step !== 'success' && (
            <div className="flex w-full items-center justify-between">
              <p className="text-sm text-text-sub-1">
                {t('auth.signup.haveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('auth_modal_open', {
                      locale,
                      page_path: pagePath,
                      modal: 'login',
                      entry_point: 'auth_modal_switch',
                      is_authenticated: false,
                      user_role: 'unknown',
                    });
                    openLogin();
                  }}
                  className="underline underline-offset-2"
                >
                  {t('auth.signup.loginLink')}
                </button>
              </p>
              <button
                type="button"
                onClick={closeAll}
                aria-label={t('auth.signup.closeAria')}
                className="rounded-sm p-1 text-text-title-2 hover:bg-gray-50"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )}

          <div className="flex w-full max-w-[440px] flex-col items-center gap-10">
            <DialogDescription className="sr-only">
              {t('auth.signup.description')}
            </DialogDescription>
            {step === 'method' && (
              <>
                <DialogTitle className="text-h1 text-text-title-2">
                  {t('auth.signup.title')}
                </DialogTitle>

                <div className="flex w-full flex-col gap-5">
                  <SocialLs
                    provider="google"
                    label={t('auth.signup.withGoogle')}
                    onClick={() => {
                      trackEvent('signup_start', {
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
                    label={t('auth.signup.withFacebook')}
                    onClick={() => {
                      trackEvent('signup_start', {
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
                  <div className="h-px flex-1 bg-gray-300" />
                  <span className="text-sm font-medium text-text-info">
                    {t('common.or')}
                  </span>
                  <div className="h-px flex-1 bg-gray-300" />
                </div>

                <SocialLs
                  provider="email"
                  label={t('auth.signup.withEmail')}
                  onClick={() => {
                    trackEvent('signup_start', {
                      locale,
                      page_path: pagePath,
                      method: 'email',
                      entry_point: 'other',
                      is_authenticated: false,
                      user_role: 'unknown',
                    });
                    setStep('form');
                  }}
                />
              </>
            )}

            {step === 'form' && (
              <>
                <DialogTitle className="text-h1 text-text-title-2">
                  {t('auth.signup.title')}
                </DialogTitle>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                  className="flex w-full flex-col gap-10"
                >
                  <div className="flex w-full flex-col gap-5">
                    <form.Field name="email">
                      {(field) => (
                        <div
                          className={cn(
                            'flex flex-col',
                            emailError ? 'gap-[5px]' : 'gap-5'
                          )}
                        >
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor="signup-email" className="sr-only">
                              {t('auth.signup.emailPlaceholder')}
                            </Label>
                            <LoginField
                              id="signup-email"
                              type="email"
                              autoComplete="email"
                              value={field.state.value}
                              onChange={(e) => {
                                field.handleChange(e.target.value);
                                if (emailError) {
                                  setEmailError(null);
                                }
                                if (formError) {
                                  setFormError(null);
                                }
                              }}
                              onBlur={field.handleBlur}
                              placeholder={t('auth.signup.emailPlaceholder')}
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
                          {emailError && (
                            <p className="flex items-center text-sm leading-[1.5] font-medium text-error">
                              <Icon
                                name="error"
                                size={24}
                                alt={t('auth.icon.errorAlt')}
                              />
                              {emailError}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="password">
                      {(field) => {
                        const showPasswordState = field.state.value.length > 0;
                        const passwordValid = field.state.value.length >= 8;

                        return (
                          <div
                            className={cn(
                              'flex flex-col',
                              showPasswordState ? 'gap-[5px]' : 'gap-5'
                            )}
                          >
                            <Label
                              htmlFor="signup-password"
                              className="sr-only"
                            >
                              {t('auth.signup.passwordPlaceholder')}
                            </Label>
                            <PasswordInput
                              id="signup-password"
                              autoComplete="new-password"
                              value={field.state.value}
                              onChange={(e) => {
                                field.handleChange(e.target.value);
                                if (formError) {
                                  setFormError(null);
                                }
                              }}
                              onBlur={field.handleBlur}
                              placeholder={t('auth.signup.passwordPlaceholder')}
                            />
                            {showPasswordState && (
                              <p
                                className={cn(
                                  'flex items-center text-sm leading-[1.5] font-medium',
                                  passwordValid ? 'text-success' : 'text-error'
                                )}
                              >
                                <Icon
                                  name={passwordValid ? 'success' : 'error'}
                                  size={24}
                                  alt={
                                    passwordValid
                                      ? t('auth.icon.successAlt')
                                      : t('auth.icon.errorAlt')
                                  }
                                />
                                {passwordValid
                                  ? t('auth.signup.passwordValid')
                                  : t('auth.validation.passwordMin')}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    </form.Field>
                  </div>

                  <div className="flex w-full flex-col gap-[10px]">
                    <label className="flex h-[24px] w-full cursor-pointer items-center gap-[5px] text-sm leading-[1.5] font-medium text-text-sub-1">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={privacyChecked}
                        onChange={(e) => setPrivacyChecked(e.target.checked)}
                      />
                      <Icon
                        name={privacyChecked ? 'checked' : 'unchecked'}
                        size={24}
                        alt={
                          privacyChecked
                            ? t('auth.icon.checkedAlt')
                            : t('auth.icon.uncheckedAlt')
                        }
                      />
                      {t('auth.signup.privacyAgreement')}
                    </label>

                    {formError && (
                      <p className="flex items-center text-sm leading-[1.5] font-medium text-error">
                        <Icon
                          name="error"
                          size={24}
                          alt={t('auth.icon.errorAlt')}
                        />
                        {formError}
                      </p>
                    )}
                  </div>

                  <form.Subscribe
                    selector={(s) => ({
                      isSubmitting: s.isSubmitting,
                      email: s.values.email,
                      password: s.values.password,
                    })}
                  >
                    {({ isSubmitting, email, password }) => {
                      const disabled =
                        isSubmitting ||
                        !privacyChecked ||
                        !email ||
                        !password ||
                        password.length < 8 ||
                        Boolean(emailError);

                      return (
                        <Button
                          type="submit"
                          variant={disabled ? 'brand-disabled' : 'brand'}
                          size="brand-lg"
                          disabled={disabled}
                          className="w-full"
                        >
                          {isSubmitting
                            ? t('auth.signup.submitting')
                            : t('auth.signup.submit')}
                        </Button>
                      );
                    }}
                  </form.Subscribe>
                </form>
              </>
            )}

            {step === 'success' && (
              <div className="flex w-full flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-5">
                  <div className="flex size-[150px] items-center justify-center rounded-full bg-brand">
                    <span aria-hidden className="text-display text-white">
                      ✓
                    </span>
                  </div>
                  <DialogTitle className="text-h2 text-text-title-1">
                    {t('auth.signup.successTitle')}
                  </DialogTitle>
                </div>
                <p className="text-center text-h4 text-text-sub-1">
                  {t('auth.signup.successDescription')}
                </p>
                <Button
                  onClick={closeAll}
                  variant="brand"
                  size="brand-lg"
                  className="w-full"
                >
                  {t('auth.signup.submit')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
