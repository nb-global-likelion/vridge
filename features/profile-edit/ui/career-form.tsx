'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { profileCareerSchema } from '@/lib/validations/profile';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormDropdown } from '@/components/ui/form-dropdown';
import {
  getEmploymentTypeOptions,
  getExperienceLevelOptions,
} from '@/lib/frontend/presentation';
import { useI18n } from '@/lib/i18n/client';
import {
  useAddCareer,
  useUpdateCareer,
  useDeleteCareer,
} from '../model/use-profile-mutations';

type JobFamily = {
  id: string;
  displayNameEn: string;
  jobs: { id: string; displayNameEn: string }[];
};

type CareerData = {
  companyName: string;
  positionTitle: string;
  jobId: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  description?: string;
  experienceLevel?: string;
  sortOrder: number;
};

type CareerFormProps = {
  jobFamilies: JobFamily[];
  onSuccess: () => void;
  careerId?: string;
  initialData?: CareerData;
};

function FieldError({ errors }: { errors: unknown[] }) {
  if (errors.length === 0) return null;
  const msg =
    typeof errors[0] === 'object' && errors[0] !== null
      ? (errors[0] as { message: string }).message
      : String(errors[0]);
  return <p className="text-xs text-destructive">{msg}</p>;
}

export function CareerForm({
  jobFamilies,
  onSuccess,
  careerId,
  initialData,
}: CareerFormProps) {
  const { t } = useI18n();
  const addCareer = useAddCareer();
  const updateCareer = useUpdateCareer();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = careerId ? updateCareer : addCareer;

  const defaultValues: CareerData = {
    companyName: initialData?.companyName ?? '',
    positionTitle: initialData?.positionTitle ?? '',
    jobId: initialData?.jobId ?? '',
    employmentType: initialData?.employmentType ?? '',
    startDate: initialData?.startDate ?? '',
    endDate: initialData?.endDate,
    description: initialData?.description,
    experienceLevel: initialData?.experienceLevel,
    sortOrder: initialData?.sortOrder ?? 0,
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: profileCareerSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const payload = value;
      if (careerId) {
        updateCareer.mutate(
          { id: careerId, data: payload },
          { onSuccess, onError: (err) => setServerError(err.message) }
        );
      } else {
        addCareer.mutate(payload, {
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
      <form.Field name="companyName">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="career-company">{t('form.companyName')}</Label>
            <Input
              id="career-company"
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

      <form.Field name="positionTitle">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="career-position">{t('form.jobRole')}</Label>
            <Input
              id="career-position"
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

      <form.Field name="jobId">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>{t('form.field')}</Label>
            <Select
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('form.select')} />
              </SelectTrigger>
              <SelectContent>
                {jobFamilies.map((family) => (
                  <SelectGroup key={family.id}>
                    <SelectLabel>{family.displayNameEn}</SelectLabel>
                    {family.jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.displayNameEn}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="employmentType">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>{t('form.employmentType')}</Label>
            <Select
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('form.select')} />
              </SelectTrigger>
              <SelectContent>
                {getEmploymentTypeOptions(t).map(({ value, label }) => (
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

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="startDate">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="career-start">{t('form.startDate')}</Label>
              <Input
                id="career-start"
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
              <Label htmlFor="career-end">{t('form.endDateOptional')}</Label>
              <Input
                id="career-end"
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

      <form.Field name="description">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="career-desc">{t('form.descriptionOptional')}</Label>
            <Textarea
              id="career-desc"
              rows={3}
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value || undefined)}
              onBlur={field.handleBlur}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="experienceLevel">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>{t('form.experienceLevel')}</Label>
            <FormDropdown
              value={field.state.value}
              options={getExperienceLevelOptions(t)}
              placeholder={t('form.select')}
              onChange={(value) => field.handleChange(value)}
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

type Career = CareerData & { id: string };

type CareerSectionProps = {
  careers: Career[];
  jobFamilies: JobFamily[];
};

export function CareerSection({ careers, jobFamilies }: CareerSectionProps) {
  const { t } = useI18n();
  const router = useRouter();
  const deleteCareer = useDeleteCareer();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);

  const openAdd = () => {
    setEditingCareer(null);
    setDialogOpen(true);
  };

  const openEdit = (career: Career) => {
    setEditingCareer(career);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      {careers.length > 0 && (
        <ul className="flex flex-col gap-2">
          {careers.map((career) => (
            <li
              key={career.id}
              className="flex items-center justify-between rounded border p-3"
            >
              <div>
                <p className="font-medium">{career.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  {career.positionTitle}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(career)}
                >
                  {t('common.actions.edit')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    deleteCareer.mutate(career.id, {
                      onSuccess: () => router.refresh(),
                    })
                  }
                >
                  {t('common.actions.delete')}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button variant="outline" onClick={openAdd}>
        {t('profile.actions.addExperience')}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCareer
                ? t('profile.dialog.editSection', {
                    section: t('profile.experience'),
                  })
                : t('profile.dialog.addSection', {
                    section: t('profile.experience'),
                  })}
            </DialogTitle>
          </DialogHeader>
          <CareerForm
            jobFamilies={jobFamilies}
            onSuccess={handleSuccess}
            careerId={editingCareer?.id}
            initialData={editingCareer ?? undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
