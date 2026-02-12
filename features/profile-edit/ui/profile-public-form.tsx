'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { profilePublicSchema } from '@/lib/validations/profile';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUpdateProfilePublic } from '../model/use-profile-mutations';

type Props = {
  initialData?: {
    firstName: string;
    lastName: string;
    aboutMe?: string | null;
  };
};

export function ProfilePublicForm({ initialData }: Props) {
  const router = useRouter();
  const mutation = useUpdateProfilePublic();
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultValues: {
    firstName: string;
    lastName: string;
    aboutMe?: string;
  } = {
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    aboutMe: initialData?.aboutMe ?? undefined,
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
              <Label htmlFor="pub-firstName">이름</Label>
              <Input
                id="pub-firstName"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
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

        <form.Field name="lastName">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pub-lastName">성</Label>
              <Input
                id="pub-lastName"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
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
      </div>

      <form.Field name="aboutMe">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pub-aboutMe">소개</Label>
            <Textarea
              id="pub-aboutMe"
              rows={4}
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
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
