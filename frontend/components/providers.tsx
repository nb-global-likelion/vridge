'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { I18nProvider } from '@/shared/i18n/client';
import type { AppLocale, TranslationMessages } from '@/shared/i18n/types';

type ProvidersProps = {
  children: React.ReactNode;
  locale: AppLocale;
  messages: TranslationMessages;
};

export default function Providers({
  children,
  locale,
  messages,
}: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider locale={locale} messages={messages}>
        {children}
      </I18nProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
