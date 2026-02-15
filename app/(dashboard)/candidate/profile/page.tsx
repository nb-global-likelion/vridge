import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/section-title';
import { ProfileCard } from '@/entities/profile/ui/profile-card';
import { EducationList } from '@/entities/profile/ui/education-list';
import { SkillBadges } from '@/entities/profile/ui/skill-badges';
import { CareerList } from '@/entities/profile/ui/career-list';
import { CertificationList } from '@/entities/profile/ui/certification-list';
import { LanguageList } from '@/entities/profile/ui/language-list';
import { UrlList } from '@/entities/profile/ui/url-list';
import { getMyProfile } from '@/lib/actions/profile';
import { requireUser } from '@/lib/infrastructure/auth-utils';
import { getServerI18n } from '@/lib/i18n/server';
import { getActionErrorMessage } from '@/lib/i18n/action-error';

export default async function CandidateProfilePage() {
  const { t } = await getServerI18n();
  const user = await requireUser();
  const result = await getMyProfile();

  if ('errorCode' in result) {
    return (
      <p className="p-6 text-destructive">{getActionErrorMessage(result, t)}</p>
    );
  }

  const {
    profilePublic,
    profilePrivate,
    careers,
    educations,
    languages,
    urls,
    profileSkills,
    certifications,
  } = result.data;

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 pb-24">
        <section className="rounded-[20px] bg-white px-10 py-5">
          <SectionTitle title={t('profile.basicProfile')} />
          <div className="mt-6">
            <ProfileCard
              firstName={profilePublic?.firstName ?? ''}
              lastName={profilePublic?.lastName ?? ''}
              dateOfBirth={profilePublic?.dateOfBirth ?? undefined}
              phone={profilePrivate?.phoneNumber}
              email={user.email}
              location={profilePublic?.location}
              headline={profilePublic?.headline}
              aboutMe={profilePublic?.aboutMe}
              isOpenToWork={profilePublic?.isOpenToWork ?? false}
              profileImageUrl={profilePublic?.profileImageUrl}
            />
          </div>
        </section>

        <section className="rounded-[20px] bg-white px-10 py-5">
          <SectionTitle title={t('profile.education')} />
          <div className="mt-6">
            <EducationList educations={educations} />
          </div>
        </section>

        <section className="rounded-[20px] bg-white px-10 py-5">
          <SectionTitle title={t('profile.skills')} />
          <div className="mt-6">
            <SkillBadges skills={profileSkills} />
          </div>
        </section>

        <section className="rounded-[20px] bg-white px-10 py-5">
          <SectionTitle title={t('profile.experience')} />
          <div className="mt-6">
            <CareerList careers={careers} />
          </div>
        </section>

        <section className="rounded-[20px] bg-white px-10 py-5">
          <SectionTitle title={t('profile.certification')} />
          <div className="mt-6">
            <CertificationList certifications={certifications} />
          </div>
        </section>

        <section className="rounded-[20px] bg-white px-10 py-5">
          <SectionTitle title={t('profile.languages')} />
          <div className="mt-6">
            <LanguageList languages={languages} />
          </div>
        </section>

        <section className="rounded-[20px] bg-white px-10 py-5">
          <SectionTitle title={t('profile.portfolio')} />
          <div className="mt-6">
            <UrlList urls={urls} />
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-end">
          <Button asChild variant="brand" size="brand-lg">
            <Link href="/candidate/profile/edit">
              {t('profile.actions.editProfile')}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
