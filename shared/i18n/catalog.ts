import type { AppLocale } from './types';

type LocalizedCatalogEntry = {
  displayNameEn?: string | null;
  displayNameKo?: string | null;
  displayNameVi?: string | null;
};

export function getLocalizedCatalogName(
  item: LocalizedCatalogEntry,
  locale: AppLocale
): string {
  if (locale === 'ko' && item.displayNameKo) return item.displayNameKo;
  if (locale === 'vi' && item.displayNameVi) return item.displayNameVi;
  if (item.displayNameEn) return item.displayNameEn;
  if (item.displayNameKo) return item.displayNameKo;
  if (item.displayNameVi) return item.displayNameVi;
  return '';
}
