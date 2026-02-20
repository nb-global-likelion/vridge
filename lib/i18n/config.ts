import type { AppLocale } from './types';

export const SUPPORTED_LOCALES: AppLocale[] = ['vi', 'en', 'ko'];
export const DEFAULT_LOCALE: AppLocale = 'vi';
export const LOCALE_COOKIE_NAME = 'vridge_locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function isSupportedLocale(
  value: string | undefined
): value is AppLocale {
  if (!value) return false;
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}
