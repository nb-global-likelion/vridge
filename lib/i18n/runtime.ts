import type {
  AppLocale,
  TranslationMessages,
  TranslationValues,
  Translator,
} from './types';

const warnedMissingKeys = new Set<string>();

function interpolate(template: string, values?: TranslationValues): string {
  if (!values) return template;
  return template.replace(/\{([A-Za-z0-9_]+)\}/g, (match, token) => {
    const value = values[token];
    if (value === undefined || value === null) return match;
    return String(value);
  });
}

export function createTranslator(
  locale: AppLocale,
  messages: TranslationMessages,
  fallbackMessages: TranslationMessages
): Translator {
  return (key, values) => {
    const localized = messages[key];
    if (localized) return interpolate(localized, values);

    const fallback = fallbackMessages[key];
    if (fallback) return interpolate(fallback, values);

    if (process.env.NODE_ENV !== 'production') {
      const warningId = `${locale}:${key}`;
      if (!warnedMissingKeys.has(warningId)) {
        warnedMissingKeys.add(warningId);

        console.warn(
          `[i18n] Missing translation key "${key}" for locale "${locale}"`
        );
      }
    }

    return key;
  };
}
