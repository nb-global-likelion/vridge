'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { profilePrivateSchema } from '@/lib/validations/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUpdateProfilePrivate } from '../model/use-profile-mutations';

type Props = {
  initialData?: { phoneNumber?: string | null };
};

export function ContactForm({ initialData }: Props) {
  const router = useRouter();
  const mutation = useUpdateProfilePrivate();
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultValues: { phoneNumber?: string } = {
    phoneNumber: initialData?.phoneNumber ?? undefined,
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: profilePrivateSchema },
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
      <form.Field name="phoneNumber">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-phone">연락처</Label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="+84 90 1234 5678"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value || undefined)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <p className="text-xs text-destructive">
                  {String(
                    typeof field.state.meta.errors[0] === 'object' &&
                      field.state.meta.errors[0] !== null
                      ? (field.state.meta.errors[0] as { message: string })
                          .message
                      : field.state.meta.errors[0]
                  )}
                </p>
              )}
          </div>
        )}
      </form.Field>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            {isSubmitting || mutation.isPending ? '저장 중...' : '저장'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
