'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/frontend/components/ui/select';
import { Button } from '@/frontend/components/ui/button';
import { Chip } from '@/frontend/components/ui/chip';
import { DatePicker } from '@/frontend/components/ui/date-picker';
import { DialcodePicker } from '@/frontend/components/ui/dialcode-picker';
import { FormDropdown } from '@/frontend/components/ui/form-dropdown';
import { FormInput } from '@/frontend/components/ui/form-input';
import { Icon } from '@/frontend/components/ui/icon';
import { SearchBar } from '@/frontend/components/ui/search-bar';
import { ToggleSwitch } from '@/frontend/components/ui/toggle-switch';
import { searchSkills } from '@/backend/actions/catalog';
import {
  getEducationTypeOptions,
  getEmploymentTypeOptions,
  getExperienceLevelOptions,
  getProficiencyOptions,
} from '@/frontend/lib/presentation';
import { useI18n } from '@/shared/i18n/client';
import {
  useAddCareer,
  useAddCertification,
  useAddEducation,
  useAddLanguage,
  useAddSkill,
  useAddUrl,
  useDeleteCareer,
  useDeleteCertification,
  useDeleteEducation,
  useDeleteLanguage,
  useDeleteSkill,
  useDeleteUrl,
  useUpdateCareer,
  useUpdateCertification,
  useUpdateEducation,
  useUpdateLanguage,
  useUpdateProfilePrivate,
  useUpdateProfilePublic,
  useUpdateUrl,
} from '@/frontend/features/profile-edit/model/use-profile-mutations';
import { useUnsavedChangesGuard } from '@/frontend/features/profile-edit/model/use-unsaved-changes-guard';

type JobFamily = {
  id: string;
  displayNameEn: string;
  jobs: { id: string; displayNameEn: string }[];
};

type SkillItem = { id: string; displayNameEn: string };
type SearchResult = { id: string; displayNameEn: string };

type DraftPublic = {
  firstName: string;
  lastName: string;
  aboutMe: string;
  dateOfBirth?: string;
  location: string;
  isOpenToWork: boolean;
};

type DraftContact = {
  dialCode: string;
  phoneNumber: string;
  email: string;
};

type DraftCareer = {
  id: string;
  companyName: string;
  positionTitle: string;
  jobId: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  description?: string;
  experienceLevel?: string;
};

type DraftEducation = {
  id: string;
  institutionName: string;
  educationType: string;
  field?: string;
  graduationStatus: string;
  startDate: string;
  endDate?: string;
};

type DraftCertification = {
  id: string;
  name: string;
  date: string;
  description?: string;
  institutionName?: string;
};

type DraftLanguage = {
  id: string;
  language: string;
  proficiency: string;
  testName?: string;
  testScore?: string;
};

type DraftUrl = {
  id: string;
  label: string;
  url: string;
};

type ProfileEditDraft = {
  public: DraftPublic;
  contact: DraftContact;
  skills: SkillItem[];
  careers: DraftCareer[];
  educations: DraftEducation[];
  certifications: DraftCertification[];
  languages: DraftLanguage[];
  urls: DraftUrl[];
};

type ProfileEditPageClientProps = {
  profilePublic?: {
    firstName: string;
    lastName: string;
    aboutMe?: string | null;
    dateOfBirth?: string | null;
    location?: string | null;
    isOpenToWork?: boolean | null;
  } | null;
  profilePrivate?: { phoneNumber?: string | null } | null;
  email: string;
  jobFamilies: JobFamily[];
  skills: SkillItem[];
  careers: DraftCareer[];
  educations: DraftEducation[];
  certifications: DraftCertification[];
  languages: DraftLanguage[];
  urls: DraftUrl[];
};

const EMPTY_CAREER: Omit<DraftCareer, 'id'> = {
  companyName: '',
  positionTitle: '',
  jobId: '',
  employmentType: '',
  startDate: '',
  endDate: undefined,
  description: undefined,
  experienceLevel: undefined,
};

const EMPTY_EDUCATION: Omit<DraftEducation, 'id'> = {
  institutionName: '',
  educationType: '',
  field: undefined,
  graduationStatus: 'ENROLLED',
  startDate: '',
  endDate: undefined,
};

const EMPTY_CERTIFICATION: Omit<DraftCertification, 'id'> = {
  name: '',
  date: '',
  description: undefined,
  institutionName: undefined,
};

const EMPTY_LANGUAGE: Omit<DraftLanguage, 'id'> = {
  language: '',
  proficiency: 'native',
  testName: undefined,
  testScore: undefined,
};

const EMPTY_URL: Omit<DraftUrl, 'id'> = {
  label: '',
  url: '',
};

const BASE_SECTION_CLASS = 'w-full rounded-[20px] px-[20px]';
const BASIC_SECTION_CLASS =
  'w-full rounded-[20px] bg-white px-[40px] py-[20px] border-2 border-transparent focus-within:border-brand-sub';
const TOP_PADDED_SECTION_CLASS = `${BASE_SECTION_CLASS} pt-[20px]`;

const CORE_EDUCATION_ORDER = [
  'vet_elementary',
  'vet_college',
  'higher_bachelor',
  'higher_master',
  'higher_doctorate',
  'other',
];

const GRADUATION_STATUS_ORDER = [
  'ENROLLED',
  'ON_LEAVE',
  'GRADUATED',
  'EXPECTED',
  'WITHDRAWN',
];

function SectionHeader({
  title,
  onAdd,
  addAriaLabel,
}: {
  title: string;
  onAdd?: () => void;
  addAriaLabel?: string;
}) {
  return (
    <div className="flex h-[43px] flex-col justify-center gap-[10px]">
      <div className="flex items-center justify-between">
        <h2 className="text-h2 text-text-title-2">{title}</h2>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex size-[32px] items-center justify-center"
            aria-label={addAriaLabel ?? title}
          >
            <span className="text-[30px] leading-[1.5] text-text-title-2">
              +
            </span>
          </button>
        )}
      </div>
      <div className="h-px w-full bg-gray-100" />
    </div>
  );
}

function createTempId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    return `tmp-${prefix}-${crypto.randomUUID()}`;
  return `tmp-${prefix}-${Math.random().toString(36).slice(2)}`;
}

function splitPhoneNumber(value?: string | null) {
  if (!value) return { dialCode: '+84', phoneNumber: '' };
  const trimmed = value.trim();
  const match = trimmed.match(/^(\+\d{1,3})\s*(.*)$/);
  if (!match) return { dialCode: '+84', phoneNumber: trimmed };
  return {
    dialCode: match[1],
    phoneNumber: match[2],
  };
}

function joinPhoneNumber(contact: DraftContact) {
  const phone = contact.phoneNumber.trim();
  if (!phone) return undefined;
  return `${contact.dialCode} ${phone}`.trim();
}

function toDateString(date: Date) {
  return date.toISOString().split('T')[0];
}

function fromDateString(value?: string) {
  if (!value) return undefined;
  return new Date(`${value}T00:00:00.000Z`);
}

function normalizeText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function cloneDraft(draft: ProfileEditDraft): ProfileEditDraft {
  return JSON.parse(JSON.stringify(draft)) as ProfileEditDraft;
}

function toComparableDraft(draft: ProfileEditDraft) {
  return {
    public: {
      firstName: draft.public.firstName.trim(),
      lastName: draft.public.lastName.trim(),
      aboutMe: normalizeText(draft.public.aboutMe),
      dateOfBirth: draft.public.dateOfBirth || undefined,
      location: normalizeText(draft.public.location),
      isOpenToWork: Boolean(draft.public.isOpenToWork),
    },
    contact: {
      phoneNumber: joinPhoneNumber(draft.contact),
    },
    skills: draft.skills.map((skill) => skill.id).sort(),
    careers: draft.careers.map((career, index) => ({
      id: career.id,
      companyName: career.companyName.trim(),
      positionTitle: career.positionTitle.trim(),
      jobId: career.jobId,
      employmentType: career.employmentType,
      startDate: career.startDate,
      endDate: career.endDate || undefined,
      description: normalizeText(career.description),
      experienceLevel: career.experienceLevel || undefined,
      sortOrder: index,
    })),
    educations: draft.educations.map((education, index) => ({
      id: education.id,
      institutionName: education.institutionName.trim(),
      educationType: education.educationType,
      field: normalizeText(education.field),
      graduationStatus: education.graduationStatus,
      startDate: education.startDate,
      endDate: education.endDate || undefined,
      sortOrder: index,
    })),
    certifications: draft.certifications.map((certification, index) => ({
      id: certification.id,
      name: certification.name.trim(),
      date: certification.date,
      description: normalizeText(certification.description),
      institutionName: normalizeText(certification.institutionName),
      sortOrder: index,
    })),
    languages: draft.languages.map((language, index) => ({
      id: language.id,
      language: language.language.trim(),
      proficiency: language.proficiency,
      testName: normalizeText(language.testName),
      testScore: normalizeText(language.testScore),
      sortOrder: index,
    })),
    urls: draft.urls.map((url, index) => ({
      id: url.id,
      label: url.label.trim(),
      url: url.url.trim(),
      sortOrder: index,
    })),
  };
}

function buildInitialDraft(
  props: ProfileEditPageClientProps
): ProfileEditDraft {
  const phone = splitPhoneNumber(props.profilePrivate?.phoneNumber);

  return {
    public: {
      firstName: props.profilePublic?.firstName ?? '',
      lastName: props.profilePublic?.lastName ?? '',
      aboutMe: props.profilePublic?.aboutMe ?? '',
      dateOfBirth: props.profilePublic?.dateOfBirth ?? undefined,
      location: props.profilePublic?.location ?? '',
      isOpenToWork: Boolean(props.profilePublic?.isOpenToWork),
    },
    contact: {
      dialCode: phone.dialCode,
      phoneNumber: phone.phoneNumber,
      email: props.email,
    },
    skills: props.skills,
    careers: props.careers,
    educations: props.educations,
    certifications: props.certifications,
    languages: props.languages,
    urls: props.urls,
  };
}

type SyncCollectionOptions<T extends { id: string }, P> = {
  baseline: T[];
  draft: T[];
  toPayload: (item: T, sortOrder: number) => P;
  addItem: (payload: P) => Promise<unknown>;
  updateItem: (id: string, payload: P) => Promise<unknown>;
  deleteItem: (id: string) => Promise<unknown>;
};

async function syncCollection<T extends { id: string }, P>({
  baseline,
  draft,
  toPayload,
  addItem,
  updateItem,
  deleteItem,
}: SyncCollectionOptions<T, P>) {
  const baselineMap = new Map(
    baseline.map((item, index) => [item.id, { item, index }])
  );
  const draftMap = new Map(
    draft
      .filter((item) => !item.id.startsWith('tmp-'))
      .map((item, index) => [item.id, { item, index }])
  );

  for (const [id] of baselineMap) {
    if (!draftMap.has(id)) {
      await deleteItem(id);
    }
  }

  for (const [index, draftItem] of draft.entries()) {
    const payload = toPayload(draftItem, index);
    const baselineEntry = baselineMap.get(draftItem.id);

    if (!baselineEntry || draftItem.id.startsWith('tmp-')) {
      await addItem(payload);
      continue;
    }

    const baselinePayload = toPayload(baselineEntry.item, baselineEntry.index);
    if (JSON.stringify(payload) !== JSON.stringify(baselinePayload)) {
      await updateItem(draftItem.id, payload);
    }
  }
}

export function ProfileEditPageClient(props: ProfileEditPageClientProps) {
  const { t } = useI18n();
  const router = useRouter();

  const initialDraft = useMemo(() => buildInitialDraft(props), [props]);
  const [baseline, setBaseline] = useState<ProfileEditDraft>(
    cloneDraft(initialDraft)
  );
  const [draft, setDraft] = useState<ProfileEditDraft>(
    cloneDraft(initialDraft)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updatePublic = useUpdateProfilePublic();
  const updatePrivate = useUpdateProfilePrivate();
  const addCareer = useAddCareer();
  const updateCareer = useUpdateCareer();
  const deleteCareer = useDeleteCareer();
  const addEducation = useAddEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();
  const addLanguage = useAddLanguage();
  const updateLanguage = useUpdateLanguage();
  const deleteLanguage = useDeleteLanguage();
  const addUrl = useAddUrl();
  const updateUrl = useUpdateUrl();
  const deleteUrl = useDeleteUrl();
  const addSkill = useAddSkill();
  const deleteSkill = useDeleteSkill();
  const addCertification = useAddCertification();
  const updateCertification = useUpdateCertification();
  const deleteCertification = useDeleteCertification();

  useEffect(() => {
    setBaseline(cloneDraft(initialDraft));
    setDraft(cloneDraft(initialDraft));
  }, [initialDraft]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      const response = await searchSkills(searchQuery);
      if (!('errorCode' in response)) {
        setSearchResults(response.data);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const comparableBaseline = useMemo(
    () => toComparableDraft(baseline),
    [baseline]
  );
  const comparableDraft = useMemo(() => toComparableDraft(draft), [draft]);
  const isDirty =
    JSON.stringify(comparableBaseline) !== JSON.stringify(comparableDraft);

  useUnsavedChangesGuard(isDirty);

  const selectedSkillIds = useMemo(
    () => new Set(draft.skills.map((skill) => skill.id)),
    [draft.skills]
  );
  const visibleSearchResults = searchResults.filter(
    (skill) => !selectedSkillIds.has(skill.id)
  );

  const educationOptions = useMemo(() => {
    const allOptions = getEducationTypeOptions(t);
    const byValue = new Map(allOptions.map((option) => [option.value, option]));
    const coreOptions = CORE_EDUCATION_ORDER.map((value) => {
      const option = byValue.get(value);
      return {
        value,
        label: option ? t(`profile.edit.educationOption.${value}`) : value,
      };
    });
    const extraOptions = allOptions.filter(
      (option) => !CORE_EDUCATION_ORDER.includes(option.value)
    );

    return [...coreOptions, ...extraOptions];
  }, [t]);

  const graduationStatusOptions = useMemo(
    () =>
      GRADUATION_STATUS_ORDER.map((value) => ({
        value,
        label: t(`profile.edit.graduationStatus.${value}`),
      })),
    [t]
  );
  const employmentTypeOptions = useMemo(() => getEmploymentTypeOptions(t), [t]);
  const experienceLevelOptions = useMemo(
    () => getExperienceLevelOptions(t),
    [t]
  );
  const proficiencyOptions = useMemo(() => getProficiencyOptions(t), [t]);

  function updateDraftPublic<K extends keyof DraftPublic>(
    key: K,
    value: DraftPublic[K]
  ) {
    setDraft((prev) => ({
      ...prev,
      public: {
        ...prev.public,
        [key]: value,
      },
    }));
  }

  function updateDraftContact<K extends keyof DraftContact>(
    key: K,
    value: DraftContact[K]
  ) {
    setDraft((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [key]: value,
      },
    }));
  }

  async function handleSave() {
    if (!isDirty || isSaving) return;
    setSaveError(null);
    setIsSaving(true);

    try {
      if (
        JSON.stringify(comparableDraft.public) !==
        JSON.stringify(comparableBaseline.public)
      ) {
        await updatePublic.mutateAsync({
          firstName: draft.public.firstName.trim(),
          lastName: draft.public.lastName.trim(),
          aboutMe: normalizeText(draft.public.aboutMe),
          dateOfBirth: draft.public.dateOfBirth || undefined,
          location: normalizeText(draft.public.location),
          isOpenToWork: Boolean(draft.public.isOpenToWork),
        });
      }

      if (
        JSON.stringify(comparableDraft.contact) !==
        JSON.stringify(comparableBaseline.contact)
      ) {
        await updatePrivate.mutateAsync({
          phoneNumber: joinPhoneNumber(draft.contact),
        });
      }

      const baselineSkillIds = new Set(
        baseline.skills.map((skill) => skill.id)
      );
      const draftSkillIds = new Set(draft.skills.map((skill) => skill.id));

      for (const skillId of baselineSkillIds) {
        if (!draftSkillIds.has(skillId)) {
          await deleteSkill.mutateAsync(skillId);
        }
      }

      for (const skillId of draftSkillIds) {
        if (!baselineSkillIds.has(skillId)) {
          await addSkill.mutateAsync(skillId);
        }
      }

      await syncCollection({
        baseline: baseline.careers,
        draft: draft.careers,
        toPayload: (career, sortOrder) => ({
          companyName: career.companyName.trim(),
          positionTitle: career.positionTitle.trim(),
          jobId: career.jobId,
          employmentType: career.employmentType,
          startDate: career.startDate,
          endDate: career.endDate || undefined,
          description: normalizeText(career.description),
          experienceLevel: career.experienceLevel || undefined,
          sortOrder,
        }),
        addItem: (payload) => addCareer.mutateAsync(payload),
        updateItem: (id, payload) =>
          updateCareer.mutateAsync({ id, data: payload }),
        deleteItem: (id) => deleteCareer.mutateAsync(id),
      });

      await syncCollection({
        baseline: baseline.educations,
        draft: draft.educations,
        toPayload: (education, sortOrder) => ({
          institutionName: education.institutionName.trim(),
          educationType: education.educationType,
          field: normalizeText(education.field),
          graduationStatus: education.graduationStatus,
          startDate: education.startDate,
          endDate: education.endDate || undefined,
          sortOrder,
        }),
        addItem: (payload) => addEducation.mutateAsync(payload),
        updateItem: (id, payload) =>
          updateEducation.mutateAsync({ id, data: payload }),
        deleteItem: (id) => deleteEducation.mutateAsync(id),
      });

      await syncCollection({
        baseline: baseline.certifications,
        draft: draft.certifications,
        toPayload: (certification, sortOrder) => ({
          name: certification.name.trim(),
          date: certification.date,
          description: normalizeText(certification.description),
          institutionName: normalizeText(certification.institutionName),
          sortOrder,
        }),
        addItem: (payload) => addCertification.mutateAsync(payload),
        updateItem: (id, payload) =>
          updateCertification.mutateAsync({ id, data: payload }),
        deleteItem: (id) => deleteCertification.mutateAsync(id),
      });

      await syncCollection({
        baseline: baseline.languages,
        draft: draft.languages,
        toPayload: (language, sortOrder) => ({
          language: language.language.trim(),
          proficiency: language.proficiency,
          testName: normalizeText(language.testName),
          testScore: normalizeText(language.testScore),
          sortOrder,
        }),
        addItem: (payload) => addLanguage.mutateAsync(payload),
        updateItem: (id, payload) =>
          updateLanguage.mutateAsync({ id, data: payload }),
        deleteItem: (id) => deleteLanguage.mutateAsync(id),
      });

      await syncCollection({
        baseline: baseline.urls,
        draft: draft.urls,
        toPayload: (url, sortOrder) => ({
          label: url.label.trim(),
          url: url.url.trim(),
          sortOrder,
        }),
        addItem: (payload) => addUrl.mutateAsync(payload),
        updateItem: (id, payload) =>
          updateUrl.mutateAsync({ id, data: payload }),
        deleteItem: (id) => deleteUrl.mutateAsync(id),
      });

      const nextBaseline = cloneDraft(draft);
      setBaseline(nextBaseline);
      setDraft(cloneDraft(nextBaseline));
      router.refresh();
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : t('profile.save.error')
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[40px] px-4 pt-[80px] pb-[120px] md:px-6 lg:px-0">
        <section className={BASIC_SECTION_CLASS}>
          <h2 className="text-h2 text-text-title-2">
            {t('profile.basicProfile')}
          </h2>

          <div className="mt-[25px] flex flex-col gap-[25px] lg:flex-row lg:items-center">
            <div className="flex shrink-0 items-center justify-center">
              <div className="flex h-[200px] w-[200px] items-center justify-center rounded-full bg-brand-sub">
                <Icon
                  name="profile"
                  size={96}
                  alt={t('profile.image.placeholderAlt')}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-[20px]">
              <div className="flex items-center justify-start gap-[7px]">
                <span className="text-caption-1 text-text-title-2">
                  {t('profile.hiringStatus')}
                </span>
                <ToggleSwitch
                  checked={Boolean(draft.public.isOpenToWork)}
                  onChange={(checked) =>
                    updateDraftPublic('isOpenToWork', checked)
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
                <FormInput
                  required
                  placeholder={t('form.firstName')}
                  value={draft.public.firstName}
                  onChange={(event) =>
                    updateDraftPublic('firstName', event.target.value)
                  }
                  filled={draft.public.firstName.length > 0}
                  theme="bg"
                />
                <FormInput
                  required
                  placeholder={t('form.lastName')}
                  value={draft.public.lastName}
                  onChange={(event) =>
                    updateDraftPublic('lastName', event.target.value)
                  }
                  filled={draft.public.lastName.length > 0}
                  theme="bg"
                />
              </div>

              <div className="flex items-center gap-[10px]">
                <span className="text-caption-1 text-text-title-2">
                  {t('form.dateOfBirth')}
                </span>
                <DatePicker
                  type="full"
                  value={fromDateString(draft.public.dateOfBirth)}
                  onChange={(date) =>
                    updateDraftPublic('dateOfBirth', toDateString(date))
                  }
                />
                {draft.public.dateOfBirth && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updateDraftPublic('dateOfBirth', undefined)}
                  >
                    {t('common.actions.clear')}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
                <div className="flex items-center gap-[10px]">
                  <Icon name="mobile" size={20} />
                  <DialcodePicker
                    value={draft.contact.dialCode}
                    onChange={(code) => updateDraftContact('dialCode', code)}
                  />
                  <FormInput
                    size="sm"
                    required
                    placeholder={t('form.phoneNumber')}
                    value={draft.contact.phoneNumber}
                    onChange={(event) =>
                      updateDraftContact('phoneNumber', event.target.value)
                    }
                    filled={draft.contact.phoneNumber.length > 0}
                    theme="bg"
                  />
                </div>

                <div className="flex items-center gap-[10px]">
                  <Icon name="mail" size={20} />
                  <FormInput
                    size="sm"
                    placeholder={t('form.email')}
                    value={draft.contact.email}
                    filled
                    disabled
                    readOnly
                    theme="bg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-[10px]">
                <Icon name="location" size={20} />
                <FormInput
                  required
                  size="sm"
                  placeholder={t('form.location')}
                  value={draft.public.location}
                  onChange={(event) =>
                    updateDraftPublic('location', event.target.value)
                  }
                  filled={draft.public.location.length > 0}
                  theme="bg"
                />
              </div>

              <FormInput
                size="lg"
                placeholder={t('form.aboutMe')}
                value={draft.public.aboutMe}
                onChange={(event) =>
                  updateDraftPublic('aboutMe', event.target.value)
                }
                filled={draft.public.aboutMe.length > 0}
                theme="bg"
              />
            </div>
          </div>
        </section>

        <section className={BASE_SECTION_CLASS}>
          <SectionHeader
            title={t('profile.education')}
            addAriaLabel={t('profile.actions.addAria', {
              section: t('profile.education'),
            })}
            onAdd={() =>
              setDraft((prev) => ({
                ...prev,
                educations: [
                  ...prev.educations,
                  { id: createTempId('education'), ...EMPTY_EDUCATION },
                ],
              }))
            }
          />

          <div className="mt-[25px] flex flex-col gap-[25px]">
            {draft.educations.map((education) => (
              <div
                key={education.id}
                className="relative rounded-[20px] border-2 border-transparent p-[20px] focus-within:border-brand-sub"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-[18px] right-[20px]"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      educations: prev.educations.filter(
                        (item) => item.id !== education.id
                      ),
                    }))
                  }
                >
                  <Icon name="close" size={24} />
                </Button>

                <FormInput
                  required
                  placeholder={t('form.schoolName')}
                  value={education.institutionName}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      educations: prev.educations.map((item) =>
                        item.id === education.id
                          ? { ...item, institutionName: event.target.value }
                          : item
                      ),
                    }))
                  }
                  filled={education.institutionName.length > 0}
                  theme="bg"
                />

                <div className="mt-[25px] grid grid-cols-1 gap-[25px] lg:grid-cols-[400px_1fr]">
                  <FormDropdown
                    value={education.educationType}
                    placeholder={t('form.levelOfEducation')}
                    options={educationOptions}
                    onChange={(value) =>
                      setDraft((prev) => ({
                        ...prev,
                        educations: prev.educations.map((item) =>
                          item.id === education.id
                            ? { ...item, educationType: value }
                            : item
                        ),
                      }))
                    }
                  />
                  <FormInput
                    placeholder={t('form.fieldOfStudyOptional')}
                    value={education.field ?? ''}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        educations: prev.educations.map((item) =>
                          item.id === education.id
                            ? {
                                ...item,
                                field: event.target.value || undefined,
                              }
                            : item
                        ),
                      }))
                    }
                    filled={Boolean(education.field)}
                    theme="bg"
                  />
                </div>

                <div className="mt-[25px] grid grid-cols-1 gap-[25px] xl:grid-cols-[430px_1fr]">
                  <div className="flex items-center gap-[10px]">
                    <div className="flex items-center gap-2">
                      <DatePicker
                        type="month"
                        value={fromDateString(education.startDate)}
                        onChange={(date) =>
                          setDraft((prev) => ({
                            ...prev,
                            educations: prev.educations.map((item) =>
                              item.id === education.id
                                ? { ...item, startDate: toDateString(date) }
                                : item
                            ),
                          }))
                        }
                      />
                      {education.startDate && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              educations: prev.educations.map((item) =>
                                item.id === education.id
                                  ? { ...item, startDate: '' }
                                  : item
                              ),
                            }))
                          }
                        >
                          {t('common.actions.clear')}
                        </Button>
                      )}
                    </div>
                    <span className="text-text-sub-2">-</span>
                    <div className="flex items-center gap-2">
                      <DatePicker
                        type="month"
                        value={fromDateString(education.endDate)}
                        onChange={(date) =>
                          setDraft((prev) => ({
                            ...prev,
                            educations: prev.educations.map((item) =>
                              item.id === education.id
                                ? { ...item, endDate: toDateString(date) }
                                : item
                            ),
                          }))
                        }
                      />
                      {education.endDate && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              educations: prev.educations.map((item) =>
                                item.id === education.id
                                  ? { ...item, endDate: undefined }
                                  : item
                              ),
                            }))
                          }
                        >
                          {t('common.actions.clear')}
                        </Button>
                      )}
                    </div>
                  </div>
                  <FormDropdown
                    value={education.graduationStatus}
                    placeholder={t('form.graduationStatus')}
                    options={graduationStatusOptions}
                    onChange={(value) =>
                      setDraft((prev) => ({
                        ...prev,
                        educations: prev.educations.map((item) =>
                          item.id === education.id
                            ? { ...item, graduationStatus: value }
                            : item
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={BASE_SECTION_CLASS}>
          <SectionHeader title={t('profile.skills')} />
          <div className="mt-[25px] flex flex-col gap-4">
            <SearchBar
              variant="skills"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('form.skills')}
            />
            {visibleSearchResults.length > 0 && (
              <ul className="rounded-[10px] border">
                {visibleSearchResults.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <span>{skill.displayNameEn}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          skills: [...prev.skills, skill],
                        }))
                      }
                    >
                      {t('common.actions.add')}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              {draft.skills.map((skill) => (
                <Chip
                  key={skill.id}
                  label={skill.displayNameEn}
                  variant="searched"
                  size="md"
                  onRemove={() =>
                    setDraft((prev) => ({
                      ...prev,
                      skills: prev.skills.filter(
                        (item) => item.id !== skill.id
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <section className={TOP_PADDED_SECTION_CLASS}>
          <SectionHeader
            title={t('profile.experience')}
            addAriaLabel={t('profile.actions.addAria', {
              section: t('profile.experience'),
            })}
            onAdd={() =>
              setDraft((prev) => ({
                ...prev,
                careers: [
                  ...prev.careers,
                  { id: createTempId('career'), ...EMPTY_CAREER },
                ],
              }))
            }
          />
          <div className="mt-[25px] flex flex-col gap-[25px]">
            {draft.careers.map((career) => (
              <div
                key={career.id}
                className="relative rounded-[20px] border-2 border-transparent p-[20px] focus-within:border-brand-sub"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-[18px] right-[20px]"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      careers: prev.careers.filter(
                        (item) => item.id !== career.id
                      ),
                    }))
                  }
                >
                  <Icon name="close" size={24} />
                </Button>

                <div className="grid grid-cols-1 gap-[25px]">
                  <FormInput
                    placeholder={t('form.companyName')}
                    value={career.companyName}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        careers: prev.careers.map((item) =>
                          item.id === career.id
                            ? { ...item, companyName: event.target.value }
                            : item
                        ),
                      }))
                    }
                    filled={career.companyName.length > 0}
                    theme="bg"
                  />
                  <div className="flex items-center gap-[10px]">
                    <DatePicker
                      type="month"
                      value={fromDateString(career.startDate)}
                      onChange={(date) =>
                        setDraft((prev) => ({
                          ...prev,
                          careers: prev.careers.map((item) =>
                            item.id === career.id
                              ? { ...item, startDate: toDateString(date) }
                              : item
                          ),
                        }))
                      }
                    />
                    <span className="text-text-sub-2">-</span>
                    <DatePicker
                      type="month"
                      value={fromDateString(career.endDate)}
                      onChange={(date) =>
                        setDraft((prev) => ({
                          ...prev,
                          careers: prev.careers.map((item) =>
                            item.id === career.id
                              ? { ...item, endDate: toDateString(date) }
                              : item
                          ),
                        }))
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          careers: prev.careers.map((item) =>
                            item.id === career.id
                              ? { ...item, endDate: undefined }
                              : item
                          ),
                        }))
                      }
                    >
                      {t('profile.actions.clearEndDate')}
                    </Button>
                  </div>
                </div>

                <div className="mt-[25px] grid grid-cols-1 gap-[20px] lg:grid-cols-3">
                  <FormInput
                    placeholder={t('form.jobRole')}
                    value={career.positionTitle}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        careers: prev.careers.map((item) =>
                          item.id === career.id
                            ? { ...item, positionTitle: event.target.value }
                            : item
                        ),
                      }))
                    }
                    filled={career.positionTitle.length > 0}
                    theme="bg"
                  />

                  <Select
                    value={career.jobId}
                    onValueChange={(value) =>
                      setDraft((prev) => ({
                        ...prev,
                        careers: prev.careers.map((item) =>
                          item.id === career.id
                            ? { ...item, jobId: value }
                            : item
                        ),
                      }))
                    }
                  >
                    <SelectTrigger className="h-[52px] rounded-[10px] bg-bg">
                      <SelectValue placeholder={t('form.field')} />
                    </SelectTrigger>
                    <SelectContent>
                      {props.jobFamilies.map((family) => (
                        <SelectGroup key={family.id}>
                          <SelectLabel>{family.displayNameEn}</SelectLabel>
                          {family.jobs.map((job) => (
                            <SelectItem key={job.id} value={job.id}>
                              {job.displayNameEn}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormDropdown
                    value={career.experienceLevel}
                    placeholder={t('form.experienceLevel')}
                    options={experienceLevelOptions}
                    onChange={(value) =>
                      setDraft((prev) => ({
                        ...prev,
                        careers: prev.careers.map((item) =>
                          item.id === career.id
                            ? { ...item, experienceLevel: value }
                            : item
                        ),
                      }))
                    }
                  />
                </div>

                <div className="mt-[25px] grid grid-cols-1 gap-[20px] lg:grid-cols-2">
                  <FormDropdown
                    value={career.employmentType}
                    placeholder={t('form.employmentType')}
                    options={employmentTypeOptions}
                    onChange={(value) =>
                      setDraft((prev) => ({
                        ...prev,
                        careers: prev.careers.map((item) =>
                          item.id === career.id
                            ? { ...item, employmentType: value }
                            : item
                        ),
                      }))
                    }
                  />
                </div>

                <div className="mt-[25px]">
                  <FormInput
                    size="lg"
                    placeholder={t('form.descriptionOptional')}
                    value={career.description ?? ''}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        careers: prev.careers.map((item) =>
                          item.id === career.id
                            ? {
                                ...item,
                                description: event.target.value || undefined,
                              }
                            : item
                        ),
                      }))
                    }
                    filled={Boolean(career.description)}
                    theme="bg"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={BASE_SECTION_CLASS}>
          <SectionHeader
            title={t('profile.certification')}
            addAriaLabel={t('profile.actions.addAria', {
              section: t('profile.certification'),
            })}
            onAdd={() =>
              setDraft((prev) => ({
                ...prev,
                certifications: [
                  ...prev.certifications,
                  { id: createTempId('certification'), ...EMPTY_CERTIFICATION },
                ],
              }))
            }
          />
          <div className="mt-[25px] flex flex-col gap-[25px]">
            {draft.certifications.map((certification) => (
              <div
                key={certification.id}
                className="relative rounded-[20px] border-2 border-transparent p-[20px] focus-within:border-brand-sub"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-[18px] right-[20px]"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      certifications: prev.certifications.filter(
                        (item) => item.id !== certification.id
                      ),
                    }))
                  }
                >
                  <Icon name="close" size={24} />
                </Button>

                <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-[1fr_auto]">
                  <FormInput
                    placeholder={t('form.certification')}
                    value={certification.name}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        certifications: prev.certifications.map((item) =>
                          item.id === certification.id
                            ? { ...item, name: event.target.value }
                            : item
                        ),
                      }))
                    }
                    filled={certification.name.length > 0}
                    theme="bg"
                  />
                  <DatePicker
                    type="month"
                    value={fromDateString(certification.date)}
                    onChange={(date) =>
                      setDraft((prev) => ({
                        ...prev,
                        certifications: prev.certifications.map((item) =>
                          item.id === certification.id
                            ? { ...item, date: toDateString(date) }
                            : item
                        ),
                      }))
                    }
                  />
                </div>

                <div className="mt-[25px]">
                  <FormInput
                    placeholder={t('form.institutionOptional')}
                    value={certification.institutionName ?? ''}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        certifications: prev.certifications.map((item) =>
                          item.id === certification.id
                            ? {
                                ...item,
                                institutionName:
                                  event.target.value || undefined,
                              }
                            : item
                        ),
                      }))
                    }
                    filled={Boolean(certification.institutionName)}
                    theme="bg"
                  />
                </div>

                <div className="mt-[25px]">
                  <FormInput
                    size="lg"
                    placeholder={t('form.descriptionOptional')}
                    value={certification.description ?? ''}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        certifications: prev.certifications.map((item) =>
                          item.id === certification.id
                            ? {
                                ...item,
                                description: event.target.value || undefined,
                              }
                            : item
                        ),
                      }))
                    }
                    filled={Boolean(certification.description)}
                    theme="bg"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={BASE_SECTION_CLASS}>
          <SectionHeader
            title={t('profile.languages')}
            addAriaLabel={t('profile.actions.addAria', {
              section: t('profile.languages'),
            })}
            onAdd={() =>
              setDraft((prev) => ({
                ...prev,
                languages: [
                  ...prev.languages,
                  { id: createTempId('language'), ...EMPTY_LANGUAGE },
                ],
              }))
            }
          />
          <div className="mt-[25px] flex flex-col gap-[25px]">
            {draft.languages.map((language) => (
              <div
                key={language.id}
                className="relative rounded-[20px] border-2 border-transparent p-[20px] focus-within:border-brand-sub"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-[18px] right-[20px]"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      languages: prev.languages.filter(
                        (item) => item.id !== language.id
                      ),
                    }))
                  }
                >
                  <Icon name="close" size={24} />
                </Button>

                <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-[1fr_300px]">
                  <FormInput
                    placeholder={t('form.language')}
                    value={language.language}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        languages: prev.languages.map((item) =>
                          item.id === language.id
                            ? { ...item, language: event.target.value }
                            : item
                        ),
                      }))
                    }
                    filled={language.language.length > 0}
                    theme="bg"
                  />
                  <FormDropdown
                    value={language.proficiency}
                    placeholder={t('form.proficiencyLevel')}
                    options={proficiencyOptions}
                    onChange={(value) =>
                      setDraft((prev) => ({
                        ...prev,
                        languages: prev.languages.map((item) =>
                          item.id === language.id
                            ? { ...item, proficiency: value }
                            : item
                        ),
                      }))
                    }
                  />
                </div>

                <div className="mt-[25px] grid grid-cols-1 gap-[20px] lg:grid-cols-2">
                  <FormInput
                    placeholder={t('form.testNameOptional')}
                    value={language.testName ?? ''}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        languages: prev.languages.map((item) =>
                          item.id === language.id
                            ? {
                                ...item,
                                testName: event.target.value || undefined,
                              }
                            : item
                        ),
                      }))
                    }
                    filled={Boolean(language.testName)}
                    theme="bg"
                  />
                  <FormInput
                    placeholder={t('form.scoreOptional')}
                    value={language.testScore ?? ''}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        languages: prev.languages.map((item) =>
                          item.id === language.id
                            ? {
                                ...item,
                                testScore: event.target.value || undefined,
                              }
                            : item
                        ),
                      }))
                    }
                    filled={Boolean(language.testScore)}
                    theme="bg"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={BASE_SECTION_CLASS}>
          <SectionHeader title={t('profile.portfolio')} />
          <div className="mt-[25px] flex flex-col gap-[25px]">
            <button
              type="button"
              className="flex h-[52px] w-full items-center justify-center gap-1 rounded-[10px] bg-bg px-[20px] text-caption-1 text-text-sub-1"
            >
              <Icon name="plus" size={16} />
              {t('profile.upload.file')}
            </button>
            <div className="flex items-center justify-between rounded-[20px] p-[20px]">
              <div className="flex items-center gap-[10px]">
                <Icon name="file" size={24} />
                <p className="text-body-1 text-text-body-1">
                  {t('profile.upload.uploadedFile')}
                </p>
                <div className="flex items-center gap-[10px]">
                  <span className="h-[14px] w-px bg-text-sub-2" />
                  <p className="text-body-3 text-text-sub-2">20MB</p>
                </div>
              </div>
              <Icon name="close" size={24} />
            </div>
          </div>
        </section>

        <section className={BASE_SECTION_CLASS}>
          <SectionHeader
            title={t('profile.url')}
            addAriaLabel={t('profile.actions.addAria', {
              section: t('profile.url'),
            })}
            onAdd={() =>
              setDraft((prev) => ({
                ...prev,
                urls: [...prev.urls, { id: createTempId('url'), ...EMPTY_URL }],
              }))
            }
          />
          <div className="mt-[25px] flex flex-col gap-[25px]">
            {draft.urls.map((url) => (
              <div
                key={url.id}
                className="relative rounded-[20px] border-2 border-transparent p-[20px] focus-within:border-brand-sub"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-[18px] right-[20px]"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      urls: prev.urls.filter((item) => item.id !== url.id),
                    }))
                  }
                >
                  <Icon name="close" size={24} />
                </Button>

                <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2">
                  <FormInput
                    placeholder={t('form.label')}
                    value={url.label}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        urls: prev.urls.map((item) =>
                          item.id === url.id
                            ? { ...item, label: event.target.value }
                            : item
                        ),
                      }))
                    }
                    filled={url.label.length > 0}
                    theme="bg"
                  />
                  <FormInput
                    placeholder={t('form.url')}
                    value={url.url}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        urls: prev.urls.map((item) =>
                          item.id === url.id
                            ? { ...item, url: event.target.value }
                            : item
                        ),
                      }))
                    }
                    filled={url.url.length > 0}
                    theme="bg"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 h-[81px] bg-white/80 px-[40px] py-[10px] shadow-[0_-4px_40px_0_rgba(0,0,0,0.04)] backdrop-blur-[5.7px]">
        <div className="mx-auto flex h-full w-full max-w-[1200px] items-end justify-end gap-4">
          {saveError && (
            <span className="mr-auto text-sm text-destructive">
              {saveError}
            </span>
          )}
          <Button
            type="button"
            variant={isDirty ? 'brand' : 'brand-disabled'}
            size="brand-lg"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? t('common.actions.saving') : t('common.actions.save')}
          </Button>
        </div>
      </div>
    </>
  );
}
