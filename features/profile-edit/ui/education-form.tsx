'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { profileEducationSchema } from '@/lib/validations/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EDUCATION_TYPE_LABELS } from '@/entities/profile/ui/_utils';
import {
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
} from '../model/use-profile-mutations';

type EducationData = {
  institutionName: string;
  educationType: string;
  field?: string;
  isGraduated: boolean;
  startDate: string;
  endDate?: string;
  sortOrder: number;
};

type EducationFormProps = {
  onSuccess: () => void;
  educationId?: string;
  initialData?: EducationData;
};

function FieldError({ errors }: { errors: unknown[] }) {
  if (errors.length === 0) return null;
  const msg =
    typeof errors[0] === 'object' && errors[0] !== null
      ? (errors[0] as { message: string }).message
      : String(errors[0]);
  return <p className="text-xs text-destructive">{msg}</p>;
}

export function EducationForm({
  onSuccess,
  educationId,
  initialData,
}: EducationFormProps) {
  const addEducation = useAddEducation();
  const updateEducation = useUpdateEducation();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = educationId ? updateEducation : addEducation;

  const defaultValues: EducationData = {
    institutionName: initialData?.institutionName ?? '',
    educationType: initialData?.educationType ?? '',
    field: initialData?.field ?? undefined,
    isGraduated: initialData?.isGraduated ?? false,
    startDate: initialData?.startDate ?? '',
    endDate: initialData?.endDate ?? undefined,
    sortOrder: initialData?.sortOrder ?? 0,
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: profileEducationSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const payload = value;
      if (educationId) {
        updateEducation.mutate(
          { id: educationId, data: payload },
          { onSuccess, onError: (err) => setServerError(err.message) }
        );
      } else {
        addEducation.mutate(payload, {
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
      <form.Field name="institutionName">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edu-institution">학교/기관명</Label>
            <Input
              id="edu-institution"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="educationType">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>학력 유형</Label>
            <Select
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EDUCATION_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="field">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edu-field">전공 (선택)</Label>
            <Input
              id="edu-field"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value || undefined)}
              onBlur={field.handleBlur}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="isGraduated">
        {(field) => (
          <div className="flex items-center gap-2">
            <input
              id="edu-graduated"
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
            />
            <Label htmlFor="edu-graduated">졸업</Label>
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="startDate">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edu-start">시작일</Label>
              <Input
                id="edu-start"
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="endDate">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edu-end">종료일 (선택)</Label>
              <Input
                id="edu-end"
                type="date"
                value={field.state.value ?? ''}
                onChange={(e) =>
                  field.handleChange(e.target.value || undefined)
                }
                onBlur={field.handleBlur}
              />
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>
      </div>

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

type Education = EducationData & { id: string };

export function EducationSection({ educations }: { educations: Education[] }) {
  const router = useRouter();
  const deleteEducation = useDeleteEducation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );

  const handleSuccess = () => {
    setDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      {educations.length > 0 && (
        <ul className="flex flex-col gap-2">
          {educations.map((edu) => (
            <li
              key={edu.id}
              className="flex items-center justify-between rounded border p-3"
            >
              <div>
                <p className="font-medium">{edu.institutionName}</p>
                <p className="text-sm text-muted-foreground">
                  {EDUCATION_TYPE_LABELS[edu.educationType] ??
                    edu.educationType}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingEducation(edu);
                    setDialogOpen(true);
                  }}
                >
                  편집
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    deleteEducation.mutate(edu.id, {
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
          setEditingEducation(null);
          setDialogOpen(true);
        }}
      >
        + 학력 추가
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingEducation ? '학력 편집' : '학력 추가'}
            </DialogTitle>
          </DialogHeader>
          <EducationForm
            onSuccess={handleSuccess}
            educationId={editingEducation?.id}
            initialData={editingEducation ?? undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
