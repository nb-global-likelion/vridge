'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { profileLanguageSchema } from '@/lib/validations/profile';
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
import { PROFICIENCY_LABELS } from '@/entities/profile/ui/_utils';
import {
  useAddLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
} from '../model/use-profile-mutations';

type LanguageData = {
  language: string;
  proficiency: string;
  sortOrder: number;
};

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
  const addLanguage = useAddLanguage();
  const updateLanguage = useUpdateLanguage();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = languageId ? updateLanguage : addLanguage;

  const form = useForm({
    defaultValues: {
      language: initialData?.language ?? '',
      proficiency: initialData?.proficiency ?? '',
      sortOrder: initialData?.sortOrder ?? 0,
    },
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
            <Label htmlFor="lang-language">언어</Label>
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
            <Label>숙련도</Label>
            <Select
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="숙련도 선택" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROFICIENCY_LABELS).map(([value, label]) => (
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

type Language = LanguageData & { id: string };

export function LanguageSection({ languages }: { languages: Language[] }) {
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
                  {PROFICIENCY_LABELS[lang.proficiency] ?? lang.proficiency}
                </p>
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
                  편집
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
          setEditingLanguage(null);
          setDialogOpen(true);
        }}
      >
        + 언어 추가
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLanguage ? '언어 편집' : '언어 추가'}
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
