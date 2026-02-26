import Image from 'next/image';
import { Chip } from '@/frontend/components/ui/chip';
import { Icon } from '@/frontend/components/ui/icon';
import { PostStatus } from '@/frontend/components/ui/post-status';
import { SectionTitle } from '@/frontend/components/ui/section-title';
import {
  getEducationTypeLabel,
  getEmploymentTypeLabel,
  getExperienceLevelLabel,
  getGraduationStatusLabel,
  getProficiencyLabel,
} from '@/frontend/lib/presentation';
import type { AppLocale, Translator } from '@/shared/i18n/types';

type ProfilePublic = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  location: string | null;
  aboutMe: string | null;
  isOpenToWork: boolean;
  profileImageUrl: string | null;
};

type ProfilePrivate = {
  phoneNumber: string | null;
};

type Career = {
  id: string;
  companyName: string;
  positionTitle: string;
  employmentType: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  experienceLevel: string | null;
  job: { displayNameEn: string } | null;
};

type Education = {
  id: string;
  institutionName: string;
  educationType: string;
  field: string | null;
  graduationStatus: string;
  startDate: Date;
  endDate: Date | null;
};

type Certification = {
  id: string;
  name: string;
  date: Date;
  institutionName: string | null;
};

type Language = {
  id: string;
  language: string;
  proficiency: string;
  testName: string | null;
  testScore: string | null;
};

type Url = {
  id: string;
  label: string;
  url: string;
};

type Skill = {
  skill: {
    displayNameEn: string;
  };
};

type CandidateProfileData = {
  profilePublic: ProfilePublic | null;
  profilePrivate: ProfilePrivate | null;
  careers: Career[];
  educations: Education[];
  certifications: Certification[];
  languages: Language[];
  urls: Url[];
  profileSkills: Skill[];
};

type Props = {
  data: CandidateProfileData;
  email: string | null;
  locale: AppLocale;
  t: Translator;
};

const CARD_CLASS = 'rounded-[20px] bg-bg px-[40px] pt-[20px] pb-[40px]';

function normalizeText(value?: string | null) {
  const text = value?.trim();
  return text ? text : undefined;
}

function formatDob(date: Date, locale: AppLocale) {
  const day = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
  const month = new Intl.DateTimeFormat(locale, {
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
  const year = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  return `${day}. ${month}. ${year}`;
}

function formatMonthYear(date: Date, locale: AppLocale) {
  const month = new Intl.DateTimeFormat(locale, {
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
  const year = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  return `${month} ${year}`;
}

function formatYear(date: Date) {
  return String(date.getUTCFullYear());
}

function splitDescription(text?: string | null) {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function resolvePortfolioLabel(item: Url) {
  const fromLabel = item.label.trim();
  if (fromLabel) return fromLabel;

  try {
    const parsed = new URL(item.url);
    const fileName = parsed.pathname.split('/').filter(Boolean).at(-1);
    if (fileName) return decodeURIComponent(fileName);
  } catch {
    return item.url;
  }

  return item.url;
}

function Divider() {
  return <span aria-hidden className="h-[10px] w-px bg-text-sub-2" />;
}

function ContactItem({ iconName, text }: { iconName: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-[4px] text-body-2 text-text-body-1">
      <Icon name={iconName} size={24} />
      {text}
    </span>
  );
}

function BasicProfileCard({
  profilePublic,
  profilePrivate,
  email,
  locale,
  t,
}: {
  profilePublic: ProfilePublic | null;
  profilePrivate: ProfilePrivate | null;
  email: string | null;
  locale: AppLocale;
  t: Translator;
}) {
  const firstName = profilePublic?.firstName ?? '';
  const lastName = profilePublic?.lastName ?? '';
  const summary = normalizeText(profilePublic?.aboutMe);

  return (
    <section className={`${CARD_CLASS} flex flex-col gap-[25px]`}>
      <h2 className="text-h2 text-text-title-2">{t('profile.basicProfile')}</h2>
      <div className="flex items-center gap-[25px]">
        <div className="flex flex-col items-center gap-[10px]">
          <div className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {profilePublic?.profileImageUrl ? (
              <Image
                src={profilePublic.profileImageUrl}
                width={200}
                height={200}
                alt={t('profile.image.userAlt', {
                  name: `${firstName} ${lastName}`.trim(),
                })}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <Icon
                name="profile"
                size={80}
                alt={t('profile.image.defaultAlt')}
              />
            )}
          </div>
          <PostStatus
            status={profilePublic?.isOpenToWork ? 'recruiting' : 'done'}
            size="md"
            label={
              profilePublic?.isOpenToWork ? t('profile.openToWork') : undefined
            }
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[20px]">
          <div className="flex flex-col pb-px">
            <h3 className="text-title text-text-title-2">
              {firstName} {lastName}
            </h3>
            {profilePublic?.dateOfBirth && (
              <p className="text-body-2 text-text-sub-1">
                {formatDob(profilePublic.dateOfBirth, locale)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <div className="flex flex-wrap items-center gap-[25px]">
              {normalizeText(profilePrivate?.phoneNumber) && (
                <ContactItem
                  iconName="mobile"
                  text={normalizeText(profilePrivate?.phoneNumber)!}
                />
              )}
              {normalizeText(email) && (
                <ContactItem iconName="mail" text={normalizeText(email)!} />
              )}
            </div>
            {normalizeText(profilePublic?.location) && (
              <ContactItem
                iconName="location"
                text={normalizeText(profilePublic?.location)!}
              />
            )}
          </div>

          {summary && (
            <div className="rounded-[10px] bg-white p-[20px]">
              <p className="text-body-1 text-text-body-1">{summary}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EducationSection({
  educations,
  locale,
  t,
}: {
  educations: Education[];
  locale: AppLocale;
  t: Translator;
}) {
  return (
    <section className={`${CARD_CLASS} flex flex-col gap-[25px]`}>
      <SectionTitle title={t('profile.education')} />
      {educations.length === 0 ? (
        <p className="text-body-2 text-text-sub-1">
          {t('profile.empty.education')}
        </p>
      ) : (
        <ul className="flex flex-col gap-[20px]">
          {educations.map((education) => {
            const fieldLabel =
              normalizeText(education.field) ??
              getEducationTypeLabel(education.educationType, t);
            const statusLabel = getGraduationStatusLabel(
              education.graduationStatus,
              t
            );

            return (
              <li key={education.id} className="flex flex-col">
                <p className="text-h3 text-text-body-1">
                  {education.institutionName}
                </p>
                <div className="flex flex-wrap items-center gap-[10px] text-body-2 text-text-sub-1">
                  <span>{formatMonthYear(education.startDate, locale)}</span>
                  <span>-</span>
                  <span>
                    {education.endDate
                      ? formatMonthYear(education.endDate, locale)
                      : t('profile.empty.current')}
                  </span>
                  <Divider />
                  <span>{fieldLabel}</span>
                  <Divider />
                  <span>{statusLabel}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function SkillsSection({ skills, t }: { skills: Skill[]; t: Translator }) {
  return (
    <section className={`${CARD_CLASS} flex flex-col gap-[40px]`}>
      <SectionTitle title={t('profile.skills')} />
      {skills.length === 0 ? (
        <p className="text-body-2 text-text-sub-1">
          {t('profile.empty.skills')}
        </p>
      ) : (
        <div className="flex flex-wrap gap-[10px]">
          {skills.map((item, index) => (
            <Chip
              key={`${item.skill.displayNameEn}-${index}`}
              label={item.skill.displayNameEn}
              variant="displayed"
              size="md"
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ExperienceSection({
  careers,
  t,
}: {
  careers: Career[];
  t: Translator;
}) {
  return (
    <section className={`${CARD_CLASS} flex flex-col gap-[40px]`}>
      <SectionTitle title={t('profile.experience')} />
      {careers.length === 0 ? (
        <p className="text-body-2 text-text-sub-1">
          {t('profile.empty.career')}
        </p>
      ) : (
        <ul className="flex flex-col gap-[40px]">
          {careers.map((career) => {
            const secondValue =
              career.job?.displayNameEn ??
              getEmploymentTypeLabel(career.employmentType, t);
            const experienceLabel = career.experienceLevel
              ? getExperienceLevelLabel(career.experienceLevel, t)
              : undefined;
            const descriptions = splitDescription(career.description);

            return (
              <li key={career.id} className="flex flex-col gap-[20px]">
                <div className="flex flex-col gap-[10px]">
                  <div className="flex flex-wrap items-center gap-[10px]">
                    <p className="text-h3 text-text-body-1">
                      {career.companyName}
                    </p>
                    <Divider />
                    <div className="flex items-center gap-[4px] text-caption-1 text-text-sub-2">
                      <span>{formatYear(career.startDate)}</span>
                      <span>-</span>
                      <span>
                        {career.endDate
                          ? formatYear(career.endDate)
                          : t('profile.empty.current')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-[10px] text-body-2 text-text-body-2">
                    <span>{career.positionTitle}</span>
                    <Divider />
                    <span>{secondValue}</span>
                    {experienceLabel && (
                      <>
                        <Divider />
                        <span>{experienceLabel}</span>
                      </>
                    )}
                  </div>
                </div>
                {descriptions.length > 0 && (
                  <ul className="list-disc space-y-[4px] pl-6 text-body-2 text-text-body-2">
                    {descriptions.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function CertificationSection({
  certifications,
  t,
}: {
  certifications: Certification[];
  t: Translator;
}) {
  return (
    <section className={`${CARD_CLASS} flex flex-col gap-[40px]`}>
      <SectionTitle title={t('profile.certification')} />
      {certifications.length === 0 ? (
        <p className="text-body-2 text-text-sub-1">
          {t('profile.empty.certifications')}
        </p>
      ) : (
        <ul className="flex flex-col gap-[40px]">
          {certifications.map((certification) => (
            <li key={certification.id} className="flex flex-col gap-[10px]">
              <div className="flex flex-wrap items-center gap-[10px]">
                <p className="text-h3 text-text-body-1">{certification.name}</p>
                <Divider />
                <span className="text-caption-1 text-text-sub-2">
                  {formatYear(certification.date)}
                </span>
              </div>
              {normalizeText(certification.institutionName) && (
                <p className="text-body-2 text-text-body-2">
                  {normalizeText(certification.institutionName)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function LanguageSection({
  languages,
  t,
}: {
  languages: Language[];
  t: Translator;
}) {
  return (
    <section className={`${CARD_CLASS} flex flex-col gap-[40px]`}>
      <SectionTitle title={t('profile.languages')} />
      {languages.length === 0 ? (
        <p className="text-body-2 text-text-sub-1">
          {t('profile.empty.languages')}
        </p>
      ) : (
        <ul className="flex flex-col gap-[40px]">
          {languages.map((language) => (
            <li key={language.id} className="flex flex-col gap-[10px]">
              <div className="flex flex-wrap items-center gap-[10px]">
                <p className="text-h3 text-text-body-1">{language.language}</p>
                <Divider />
                <span className="text-body-2 text-text-sub-2">
                  {getProficiencyLabel(language.proficiency, t)}
                </span>
              </div>
              {normalizeText(language.testName) &&
                normalizeText(language.testScore) && (
                  <p className="text-body-2 text-text-body-2">
                    {language.testName} · {language.testScore}
                  </p>
                )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PortfolioSection({ urls, t }: { urls: Url[]; t: Translator }) {
  return (
    <section className={`${CARD_CLASS} flex flex-col gap-[40px]`}>
      <SectionTitle title={t('profile.portfolio')} />
      {urls.length === 0 ? (
        <p className="text-h3 text-text-body-2">{t('profile.empty.urls')}</p>
      ) : (
        <ul className="flex flex-col gap-[20px]">
          {urls.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[10px] text-body-1 text-text-body-1 hover:underline"
              >
                <Icon name="file" size={24} />
                <span>{resolvePortfolioLabel(item)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function CandidateProfileContent({ data, email, locale, t }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[40px] pb-[121px]">
      <BasicProfileCard
        profilePublic={data.profilePublic}
        profilePrivate={data.profilePrivate}
        email={email}
        locale={locale}
        t={t}
      />
      <EducationSection educations={data.educations} locale={locale} t={t} />
      <SkillsSection skills={data.profileSkills} t={t} />
      <ExperienceSection careers={data.careers} t={t} />
      <CertificationSection certifications={data.certifications} t={t} />
      <LanguageSection languages={data.languages} t={t} />
      <PortfolioSection urls={data.urls} t={t} />
    </div>
  );
}
