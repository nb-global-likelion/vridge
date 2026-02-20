'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from './config';
import { enMessages } from './messages/en';
import { createTranslator } from './runtime';
import type { AppLocale, TranslationMessages, Translator } from './types';

type I18nContextValue = {
  locale: AppLocale;
  messages: TranslationMessages;
  t: Translator;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  locale: AppLocale;
  messages: TranslationMessages;
  children: ReactNode;
};

export function I18nProvider({
  locale,
  messages,
  children,
}: I18nProviderProps) {
  const t = useMemo(
    () => createTranslator(locale, messages, enMessages),
    [locale, messages]
  );

  const value = useMemo(
    () => ({
      locale,
      messages,
      t,
    }),
    [locale, messages, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export function serializeLocaleCookie(locale: AppLocale): string {
  return `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}
