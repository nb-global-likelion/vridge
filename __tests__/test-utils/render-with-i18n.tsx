import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { I18nProvider } from '@/lib/i18n/client';
import { enMessages } from '@/lib/i18n/messages/en';
import { koMessages } from '@/lib/i18n/messages/ko';
import { viMessages } from '@/lib/i18n/messages/vi';
import type { AppLocale, TranslationMessages } from '@/lib/i18n/types';

type RenderWithI18nOptions = Omit<RenderOptions, 'wrapper'> & {
  locale?: AppLocale;
  messages?: TranslationMessages;
};

const MESSAGES_BY_LOCALE: Record<AppLocale, TranslationMessages> = {
  en: enMessages,
  ko: koMessages,
  vi: viMessages,
};

export function renderWithI18n(
  ui: ReactElement,
  options: RenderWithI18nOptions = {}
) {
  const { locale = 'en', messages, ...renderOptions } = options;
  const resolvedMessages = messages ?? MESSAGES_BY_LOCALE[locale];

  return render(
    <I18nProvider locale={locale} messages={resolvedMessages}>
      {ui}
    </I18nProvider>,
    renderOptions
  );
}
