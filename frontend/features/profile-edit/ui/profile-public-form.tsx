'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import type { z } from 'zod';
import { profilePublicSchema } from '@/backend/validations/profile';
import { Label } from '@/frontend/components/ui/label';
import { Button } from '@/frontend/components/ui/button';
import { DatePicker } from '@/frontend/components/ui/date-picker';
import { ToggleSwitch } from '@/frontend/components/ui/toggle-switch';
import { FormInput } from '@/frontend/components/ui/form-input';
import { useI18n } from '@/shared/i18n/client';
import { useUpdateProfilePublic } from '../model/use-profile-mutations';

type Props = {
  initialData?: {
    firstName: string;
    lastName: string;
    aboutMe?: string | null;
    dateOfBirth?: Date | string | null;
    location?: string | null;
    headline?: string | null;
    isOpenToWork?: boolean;
  };
};

function toDateString(value?: Date | string | null): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  return value.toISOString().split('T')[0];
}

function renderError(errors: unknown[]): string {
  if (errors.length === 0) return '';
  const first = errors[0];
  if (typeof first === 'object' && first !== null) {
    return (first as { message?: string }).message ?? String(first);
  }
  return String(first);
}

export function ProfilePublicForm({ initialData }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const mutation = useUpdateProfilePublic();
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultValues: z.infer<typeof profilePublicSchema> = {
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    aboutMe: initialData?.aboutMe ?? undefined,
    dateOfBirth: toDateString(initialData?.dateOfBirth),
    location: initialData?.location ?? undefined,
    headline: initialData?.headline ?? undefined,
    isOpenToWork: initialData?.isOpenToWork ?? false,
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: profilePublicSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      mutation.mutate(value, {
        onSuccess: () => router.refresh(),
        onError: (err) => setServerError(err.message),
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="firstName">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pub-firstName">{t('form.firstName')}</Label>
              <FormInput
                id="pub-firstName"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                filled={field.state.value.length > 0}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {renderError(field.state.meta.errors)}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field name="lastName">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pub-lastName">{t('form.lastName')}</Label>
              <FormInput
                id="pub-lastName"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                filled={field.state.value.length > 0}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {renderError(field.state.meta.errors)}
                  </p>
                )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="dateOfBirth">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label>{t('form.dateOfBirth')}</Label>
              <DatePicker
                type="full"
                value={
                  field.state.value
                    ? new Date(`${field.state.value}T00:00:00.000Z`)
                    : undefined
                }
                onChange={(date) =>
                  field.handleChange(date.toISOString().split('T')[0])
                }
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {renderError(field.state.meta.errors)}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field name="location">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pub-location">{t('form.location')}</Label>
              <FormInput
                id="pub-location"
                value={field.state.value ?? ''}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                filled={Boolean(field.state.value)}
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="headline">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pub-headline">{t('form.headline')}</Label>
            <FormInput
              id="pub-headline"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              filled={Boolean(field.state.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="aboutMe">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pub-aboutMe">{t('form.aboutMe')}</Label>
            <FormInput
              id="pub-aboutMe"
              size="lg"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              filled={Boolean(field.state.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="isOpenToWork">
        {(field) => (
          <div className="flex items-center justify-between rounded-[10px] bg-[#fbfbfb] px-[20px] py-[12px]">
            <span className="text-sm text-[#333]">
              {t('profile.openToWork')}
            </span>
            <ToggleSwitch
              checked={Boolean(field.state.value)}
              onChange={(checked) => field.handleChange(checked)}
            />
          </div>
        )}
      </form.Field>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            {isSubmitting || mutation.isPending
              ? t('common.actions.saving')
              : t('common.actions.save')}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
