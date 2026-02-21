import type { AppLocale, Translator } from '@/shared/i18n/types';

type KeyMap = Record<string, string>;

const EMPLOYMENT_TYPE_KEYS: KeyMap = {
  full_time: 'enum.employmentType.full_time',
  part_time: 'enum.employmentType.part_time',
  intern: 'enum.employmentType.intern',
  freelance: 'enum.employmentType.freelance',
};

const PROFICIENCY_KEYS: KeyMap = {
  native: 'enum.proficiency.native',
  fluent: 'enum.proficiency.fluent',
  professional: 'enum.proficiency.professional',
  basic: 'enum.proficiency.basic',
};

const GRADUATION_STATUS_KEYS: KeyMap = {
  ENROLLED: 'enum.graduationStatus.ENROLLED',
  ON_LEAVE: 'enum.graduationStatus.ON_LEAVE',
  GRADUATED: 'enum.graduationStatus.GRADUATED',
  EXPECTED: 'enum.graduationStatus.EXPECTED',
  WITHDRAWN: 'enum.graduationStatus.WITHDRAWN',
};

const EXPERIENCE_LEVEL_KEYS: KeyMap = {
  ENTRY: 'enum.experienceLevel.ENTRY',
  JUNIOR: 'enum.experienceLevel.JUNIOR',
  MID: 'enum.experienceLevel.MID',
  SENIOR: 'enum.experienceLevel.SENIOR',
  LEAD: 'enum.experienceLevel.LEAD',
};

const EDUCATION_TYPE_KEYS: KeyMap = {
  vet_elementary: 'enum.educationType.vet_elementary',
  vet_intermediate: 'enum.educationType.vet_intermediate',
  vet_college: 'enum.educationType.vet_college',
  higher_bachelor: 'enum.educationType.higher_bachelor',
  higher_master: 'enum.educationType.higher_master',
  higher_doctorate: 'enum.educationType.higher_doctorate',
  continuing_education: 'enum.educationType.continuing_education',
  international_program: 'enum.educationType.international_program',
  other: 'enum.educationType.other',
};

const WORK_ARRANGEMENT_KEYS: KeyMap = {
  onsite: 'enum.workArrangement.onsite',
  hybrid: 'enum.workArrangement.hybrid',
  remote: 'enum.workArrangement.remote',
};

const APPLY_STATUS_KEYS: KeyMap = {
  applied: 'enum.applyStatus.applied',
  accepted: 'enum.applyStatus.accepted',
  rejected: 'enum.applyStatus.rejected',
  withdrawn: 'enum.applyStatus.withdrawn',
};

const PERIOD_KEYS: KeyMap = {
  year: 'enum.salaryPeriod.year',
  month: 'enum.salaryPeriod.month',
  hour: 'enum.salaryPeriod.hour',
};

function translateByKeyMap(
  value: string,
  keyMap: KeyMap,
  t: Translator
): string {
  const key = keyMap[value];
  if (!key) return value;
  return t(key);
}

function buildOptions(keyMap: KeyMap, t: Translator) {
  return Object.keys(keyMap).map((value) => ({
    value,
    label: translateByKeyMap(value, keyMap, t),
  }));
}

export function getEmploymentTypeLabel(value: string, t: Translator): string {
  return translateByKeyMap(value, EMPLOYMENT_TYPE_KEYS, t);
}

export function getProficiencyLabel(value: string, t: Translator): string {
  return translateByKeyMap(value, PROFICIENCY_KEYS, t);
}

export function getGraduationStatusLabel(value: string, t: Translator): string {
  return translateByKeyMap(value, GRADUATION_STATUS_KEYS, t);
}

export function getExperienceLevelLabel(value: string, t: Translator): string {
  return translateByKeyMap(value, EXPERIENCE_LEVEL_KEYS, t);
}

export function getEducationTypeLabel(value: string, t: Translator): string {
  return translateByKeyMap(value, EDUCATION_TYPE_KEYS, t);
}

export function getWorkArrangementLabel(value: string, t: Translator): string {
  return translateByKeyMap(value, WORK_ARRANGEMENT_KEYS, t);
}

export function getApplyStatusLabel(value: string, t: Translator): string {
  return translateByKeyMap(value, APPLY_STATUS_KEYS, t);
}

export function getEmploymentTypeOptions(t: Translator) {
  return buildOptions(EMPLOYMENT_TYPE_KEYS, t);
}

export function getProficiencyOptions(t: Translator) {
  return buildOptions(PROFICIENCY_KEYS, t);
}

export function getGraduationStatusOptions(t: Translator) {
  return buildOptions(GRADUATION_STATUS_KEYS, t);
}

export function getExperienceLevelOptions(t: Translator) {
  return buildOptions(EXPERIENCE_LEVEL_KEYS, t);
}

export function getEducationTypeOptions(t: Translator) {
  return buildOptions(EDUCATION_TYPE_KEYS, t);
}

export function formatDate(date: Date, locale: AppLocale = 'vi'): string {
  if (locale !== 'vi' && locale !== 'en' && locale !== 'ko') {
    return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  }

  return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
  period: string,
  isNegotiable: boolean,
  locale: AppLocale = 'vi',
  t: Translator
): string {
  if (isNegotiable) return t('salary.negotiable');
  if (!min && !max) return t('salary.private');

  const localeCode =
    locale === 'ko' ? 'ko-KR' : locale === 'en' ? 'en-US' : 'vi-VN';
  const fmt = (n: number) =>
    currency === 'VND' && n >= 1_000_000
      ? `${Math.round(n / 1_000_000)}M`
      : n.toLocaleString(localeCode);

  const parts = [min && fmt(min), max && fmt(max)].filter(Boolean);
  const periodLabel = t(PERIOD_KEYS[period] ?? period);

  return `${parts.join(' - ')} ${currency}/${periodLabel}`;
}
