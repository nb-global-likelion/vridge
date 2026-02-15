'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import type { z } from 'zod';
import { profileCertificationSchema } from '@/lib/validations/profile';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useAddCertification,
  useUpdateCertification,
  useDeleteCertification,
} from '../model/use-profile-mutations';

type CertificationData = z.infer<typeof profileCertificationSchema>;

type CertificationFormProps = {
  onSuccess: () => void;
  certificationId?: string;
  initialData?: CertificationData;
};

function FieldError({ errors }: { errors: unknown[] }) {
  if (errors.length === 0) return null;
  const msg =
    typeof errors[0] === 'object' && errors[0] !== null
      ? (errors[0] as { message: string }).message
      : String(errors[0]);
  return <p className="text-xs text-destructive">{msg}</p>;
}

export function CertificationForm({
  onSuccess,
  certificationId,
  initialData,
}: CertificationFormProps) {
  const addCertification = useAddCertification();
  const updateCertification = useUpdateCertification();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = certificationId ? updateCertification : addCertification;

  const defaultValues: CertificationData = {
    name: initialData?.name ?? '',
    date: initialData?.date ?? '',
    description: initialData?.description ?? undefined,
    institutionName: initialData?.institutionName ?? undefined,
    sortOrder: initialData?.sortOrder ?? 0,
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: profileCertificationSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      if (certificationId) {
        updateCertification.mutate(
          { id: certificationId, data: value },
          { onSuccess, onError: (err) => setServerError(err.message) }
        );
      } else {
        addCertification.mutate(value, {
          onSuccess,
          onError: (err) => setServerError(err.message),
        });
      }
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
      <form.Field name="name">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cert-name">자격증명</Label>
            <FormInput
              id="cert-name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              filled={field.state.value.length > 0}
            />
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="date">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>취득일</Label>
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
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="institutionName">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cert-institution">발급 기관 (선택)</Label>
            <FormInput
              id="cert-institution"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value || undefined)}
              onBlur={field.handleBlur}
              filled={Boolean(field.state.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cert-description">설명 (선택)</Label>
            <FormInput
              id="cert-description"
              size="lg"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value || undefined)}
              onBlur={field.handleBlur}
              filled={Boolean(field.state.value)}
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

type Certification = CertificationData & { id: string };

export function CertificationSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  const router = useRouter();
  const deleteCertification = useDeleteCertification();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);

  const handleSuccess = () => {
    setDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      {certifications.length > 0 && (
        <ul className="flex flex-col gap-2">
          {certifications.map((certification) => (
            <li
              key={certification.id}
              className="flex items-center justify-between rounded border p-3"
            >
              <div>
                <p className="font-medium">{certification.name}</p>
                <p className="text-sm text-muted-foreground">
                  {certification.date}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingCertification(certification);
                    setDialogOpen(true);
                  }}
                >
                  편집
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    deleteCertification.mutate(certification.id, {
                      onSuccess: () => router.refresh(),
                    })
                  }
                >
                  삭제
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="outline"
        onClick={() => {
          setEditingCertification(null);
          setDialogOpen(true);
        }}
      >
        + 자격증 추가
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCertification ? '자격증 편집' : '자격증 추가'}
            </DialogTitle>
          </DialogHeader>
          <CertificationForm
            onSuccess={handleSuccess}
            certificationId={editingCertification?.id}
            initialData={editingCertification ?? undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
