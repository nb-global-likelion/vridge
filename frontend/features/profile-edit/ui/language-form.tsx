'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import type { z } from 'zod';
import { profileLanguageSchema } from '@/backend/validations/profile';
import { Input } from '@/frontend/components/ui/input';
import { FormInput } from '@/frontend/components/ui/form-input';
import { Label } from '@/frontend/components/ui/label';
import { Button } from '@/frontend/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/frontend/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/frontend/components/ui/dialog';
import {
  getProficiencyLabel,
  getProficiencyOptions,
} from '@/frontend/lib/presentation';
import { useI18n } from '@/shared/i18n/client';
import {
  useAddLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
} from '../model/use-profile-mutations';

type LanguageData = z.infer<typeof profileLanguageSchema>;

type LanguageFormProps = {
  onSuccess: () => void;
  languageId?: string;
  initialData?: LanguageData;
};

function FieldError({ errors }: { errors: unknown[] }) {
  if (errors.length === 0) return null;
  const msg =
    errors[0] instanceof Object
      ? (errors[0] as { message: string }).message
      : String(errors[0]);
  return <p className="text-xs text-destructive">{msg}</p>;
}

export function LanguageForm({
  onSuccess,
  languageId,
  initialData,
}: LanguageFormProps) {
  const { t } = useI18n();
  const addLanguage = useAddLanguage();
  const updateLanguage = useUpdateLanguage();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = languageId ? updateLanguage : addLanguage;

  const defaultValues: LanguageData = {
    language: initialData?.language ?? '',
    proficiency: initialData?.proficiency ?? 'native',
    testName: initialData?.testName ?? undefined,
    testScore: initialData?.testScore ?? undefined,
    sortOrder: initialData?.sortOrder ?? 0,
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: profileLanguageSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      if (languageId) {
        updateLanguage.mutate(
          { id: languageId, data: value },
          { onSuccess, onError: (err) => setServerError(err.message) }
        );
      } else {
        addLanguage.mutate(value, {
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
      <form.Field name="language">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lang-language">{t('form.language')}</Label>
            <Input
              id="lang-language"
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

      <form.Field name="proficiency">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>{t('form.proficiencyLevel')}</Label>
            <Select
              value={field.state.value}
              onValueChange={(value) =>
                field.handleChange(value as LanguageData['proficiency'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('form.select')} />
              </SelectTrigger>
              <SelectContent>
                {getProficiencyOptions(t).map(({ value, label }) => (
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

      <form.Field name="testName">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lang-test-name">{t('form.testNameOptional')}</Label>
            <FormInput
              id="lang-test-name"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value || undefined)}
              onBlur={field.handleBlur}
              filled={Boolean(field.state.value)}
              theme="bg"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="testScore">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lang-test-score">{t('form.scoreOptional')}</Label>
            <FormInput
              id="lang-test-score"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value || undefined)}
              onBlur={field.handleBlur}
              filled={Boolean(field.state.value)}
              theme="bg"
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

type Language = LanguageData & { id: string };

export function LanguageSection({ languages }: { languages: Language[] }) {
  const { t } = useI18n();
  const router = useRouter();
  const deleteLanguage = useDeleteLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);

  const handleSuccess = () => {
    setDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      {languages.length > 0 && (
        <ul className="flex flex-col gap-2">
          {languages.map((lang) => (
            <li
              key={lang.id}
              className="flex items-center justify-between rounded border p-3"
            >
              <div>
                <p className="font-medium">{lang.language}</p>
                <p className="text-sm text-muted-foreground">
                  {getProficiencyLabel(lang.proficiency, t)}
                </p>
                {lang.testName && lang.testScore && (
                  <p className="text-sm text-muted-foreground">
                    {lang.testName} · {lang.testScore}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingLanguage(lang);
                    setDialogOpen(true);
                  }}
                >
                  {t('common.actions.edit')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    deleteLanguage.mutate(lang.id, {
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
      <Button
        variant="outline"
        onClick={() => {
          setEditingLanguage(null);
          setDialogOpen(true);
        }}
      >
        {t('profile.actions.addLanguage')}
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLanguage
                ? t('profile.dialog.editSection', {
                    section: t('profile.languages'),
                  })
                : t('profile.dialog.addSection', {
                    section: t('profile.languages'),
                  })}
            </DialogTitle>
          </DialogHeader>
          <LanguageForm
            onSuccess={handleSuccess}
            languageId={editingLanguage?.id}
            initialData={editingLanguage ?? undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
