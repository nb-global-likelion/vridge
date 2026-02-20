import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  isSupportedLocale,
} from './config';
import { enMessages } from './messages/en';
import { koMessages } from './messages/ko';
import { viMessages } from './messages/vi';
import { createTranslator } from './runtime';
import type { AppLocale, TranslationMessages } from './types';

const MESSAGE_TABLE: Record<AppLocale, TranslationMessages> = {
  vi: viMessages,
  en: enMessages,
  ko: koMessages,
};

export function resolveLocale(value?: string | null): AppLocale {
  if (!value) return DEFAULT_LOCALE;
  if (isSupportedLocale(value)) return value;
  return DEFAULT_LOCALE;
}

export function readLocaleFromCookieHeader(cookieHeader?: string): AppLocale {
  if (!cookieHeader) return DEFAULT_LOCALE;

  const localeCookie = cookieHeader
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${LOCALE_COOKIE_NAME}=`));

  if (!localeCookie) return DEFAULT_LOCALE;
  const [, rawValue] = localeCookie.split('=');
  return resolveLocale(rawValue);
}

export function getMessagesForLocale(locale: AppLocale): TranslationMessages {
  return MESSAGE_TABLE[locale] ?? MESSAGE_TABLE[DEFAULT_LOCALE];
}

export async function getServerLocale(): Promise<AppLocale> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  return resolveLocale(locale);
}

export async function getServerI18n() {
  const locale = await getServerLocale();
  const messages = getMessagesForLocale(locale);
  const t = createTranslator(locale, messages, enMessages);

  return { locale, messages, t };
}
