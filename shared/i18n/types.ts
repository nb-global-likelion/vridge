export type AppLocale = 'vi' | 'en' | 'ko';

export type TranslationMessages = Record<string, string>;

export type TranslationValues = Record<string, string | number>;

export type Translator = (key: string, values?: TranslationValues) => string;
