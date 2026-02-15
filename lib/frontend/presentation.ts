import type { AppLocale, Translator } from '@/lib/i18n/types';

type LabelMap = Record<string, string>;
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

export function formatDate(date: Date, locale: AppLocale = 'vi'): string {
  if (locale !== 'vi' && locale !== 'en' && locale !== 'ko') {
    return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  }
  return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function resolveLegacyLabel(value: string, labels: LabelMap): string {
  return labels[value] ?? value;
}

const LEGACY_EMPLOYMENT_TYPE_LABELS: LabelMap = {
  full_time: '정규직',
  part_time: '파트타임',
  intern: '인턴',
  freelance: '프리랜서',
};

const LEGACY_PROFICIENCY_LABELS: LabelMap = {
  native: '원어민',
  fluent: '유창',
  professional: '업무 가능',
  basic: '기초',
};

const LEGACY_GRADUATION_STATUS_LABELS: LabelMap = {
  ENROLLED: '재학 중',
  ON_LEAVE: '휴학',
  GRADUATED: '졸업',
  EXPECTED: '졸업 예정',
  WITHDRAWN: '중퇴',
};

const LEGACY_EXPERIENCE_LEVEL_LABELS: LabelMap = {
  ENTRY: 'Entry',
  JUNIOR: 'Junior',
  MID: 'Mid',
  SENIOR: 'Senior',
  LEAD: 'Lead',
};

const LEGACY_EDUCATION_TYPE_LABELS: LabelMap = {
  vet_elementary: '직업 초급',
  vet_intermediate: '직업 중급',
  vet_college: '직업 대학',
  higher_bachelor: '학사',
  higher_master: '석사',
  higher_doctorate: '박사',
  continuing_education: '평생교육',
  international_program: '국제 프로그램',
  other: '기타',
};

const LEGACY_WORK_ARRANGEMENT_LABELS: LabelMap = {
  onsite: '오피스',
  hybrid: '하이브리드',
  remote: '원격',
};

const LEGACY_APPLY_STATUS_LABELS: LabelMap = {
  applied: '지원완료',
  accepted: '합격',
  rejected: '불합격',
  withdrawn: '취소',
};

const LEGACY_PERIOD_LABELS: LabelMap = {
  year: '년',
  month: '월',
  hour: '시',
};

// Legacy exports are kept temporarily while components migrate to i18n helpers.
export const EMPLOYMENT_TYPE_LABELS = LEGACY_EMPLOYMENT_TYPE_LABELS;
export const PROFICIENCY_LABELS = LEGACY_PROFICIENCY_LABELS;
export const GRADUATION_STATUS_LABELS = LEGACY_GRADUATION_STATUS_LABELS;
export const EXPERIENCE_LEVEL_LABELS = LEGACY_EXPERIENCE_LEVEL_LABELS;
export const EDUCATION_TYPE_LABELS = LEGACY_EDUCATION_TYPE_LABELS;
export const WORK_ARRANGEMENT_LABELS = LEGACY_WORK_ARRANGEMENT_LABELS;
export const APPLY_STATUS_LABELS = LEGACY_APPLY_STATUS_LABELS;

export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
  period: string,
  isNegotiable: boolean,
  locale: AppLocale = 'vi',
  t?: Translator
): string {
  if (isNegotiable) return t ? t('salary.negotiable') : '협의';
  if (!min && !max) return t ? t('salary.private') : '비공개';

  const localeCode =
    locale === 'ko' ? 'ko-KR' : locale === 'en' ? 'en-US' : 'vi-VN';
  const fmt = (n: number) =>
    currency === 'VND' && n >= 1_000_000
      ? `${Math.round(n / 1_000_000)}M`
      : n.toLocaleString(localeCode);

  const parts = [min && fmt(min), max && fmt(max)].filter(Boolean);
  const periodLabel = t
    ? t(PERIOD_KEYS[period] ?? period)
    : resolveLegacyLabel(period, LEGACY_PERIOD_LABELS);

  return `${parts.join(' - ')} ${currency}/${periodLabel}`;
}
