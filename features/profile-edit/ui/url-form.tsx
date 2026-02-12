'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { profileUrlSchema } from '@/lib/validations/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useAddUrl,
  useUpdateUrl,
  useDeleteUrl,
} from '../model/use-profile-mutations';

type UrlData = {
  label: string;
  url: string;
  sortOrder: number;
};

type UrlFormProps = {
  onSuccess: () => void;
  urlId?: string;
  initialData?: UrlData;
};

function FieldError({ errors }: { errors: unknown[] }) {
  if (errors.length === 0) return null;
  const msg =
    errors[0] instanceof Object
      ? (errors[0] as { message: string }).message
      : String(errors[0]);
  return <p className="text-xs text-destructive">{msg}</p>;
}

export function UrlForm({ onSuccess, urlId, initialData }: UrlFormProps) {
  const addUrl = useAddUrl();
  const updateUrl = useUpdateUrl();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = urlId ? updateUrl : addUrl;

  const form = useForm({
    defaultValues: {
      label: initialData?.label ?? '',
      url: initialData?.url ?? '',
      sortOrder: initialData?.sortOrder ?? 0,
    },
    validators: { onSubmit: profileUrlSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      if (urlId) {
        updateUrl.mutate(
          { id: urlId, data: value },
          { onSuccess, onError: (err) => setServerError(err.message) }
        );
      } else {
        addUrl.mutate(value, {
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
      <form.Field name="label">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url-label">레이블</Label>
            <Input
              id="url-label"
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

      <form.Field name="url">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url-url">URL</Label>
            <Input
              id="url-url"
              type="url"
              placeholder="https://"
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

type Url = UrlData & { id: string };

export function UrlSection({ urls }: { urls: Url[] }) {
  const router = useRouter();
  const deleteUrl = useDeleteUrl();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUrl, setEditingUrl] = useState<Url | null>(null);

  const handleSuccess = () => {
    setDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      {urls.length > 0 && (
        <ul className="flex flex-col gap-2">
          {urls.map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between rounded border p-3"
            >
              <div>
                <p className="font-medium">{u.label}</p>
                <p className="max-w-xs truncate text-sm text-muted-foreground">
                  {u.url}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingUrl(u);
                    setDialogOpen(true);
                  }}
                >
                  편집
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    deleteUrl.mutate(u.id, {
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
          setEditingUrl(null);
          setDialogOpen(true);
        }}
      >
        + 링크 추가
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUrl ? '링크 편집' : '링크 추가'}</DialogTitle>
          </DialogHeader>
          <UrlForm
            onSuccess={handleSuccess}
            urlId={editingUrl?.id}
            initialData={editingUrl ?? undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
