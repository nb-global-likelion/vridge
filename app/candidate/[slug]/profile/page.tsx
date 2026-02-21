import { Card, CardContent, CardHeader } from '@/frontend/components/ui/card';
import { SectionTitle } from '@/frontend/components/ui/section-title';
import { ProfileCard } from '@/frontend/entities/profile/ui/profile-card';
import { EducationList } from '@/frontend/entities/profile/ui/education-list';
import { SkillBadges } from '@/frontend/entities/profile/ui/skill-badges';
import { CareerList } from '@/frontend/entities/profile/ui/career-list';
import { CertificationList } from '@/frontend/entities/profile/ui/certification-list';
import { LanguageList } from '@/frontend/entities/profile/ui/language-list';
import { UrlList } from '@/frontend/entities/profile/ui/url-list';
import { getProfileBySlug } from '@/backend/actions/profile';
import { getServerI18n } from '@/shared/i18n/server';
import { getActionErrorMessage } from '@/shared/i18n/action-error';

export default async function CandidatePublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { t } = await getServerI18n();
  const { slug } = await params;
  const result = await getProfileBySlug(slug);

  if ('errorCode' in result) {
    return (
      <p className="p-6 text-destructive">{getActionErrorMessage(result, t)}</p>
    );
  }

  const {
    authUser,
    profilePublic,
    careers,
    educations,
    languages,
    urls,
    profileSkills,
    certifications,
  } = result.data;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8">
      <Card>
        <CardHeader>
          <SectionTitle title={t('profile.basicProfile')} />
        </CardHeader>
        <CardContent>
          <ProfileCard
            firstName={profilePublic?.firstName ?? ''}
            lastName={profilePublic?.lastName ?? ''}
            dateOfBirth={profilePublic?.dateOfBirth ?? undefined}
            email={authUser?.email}
            location={profilePublic?.location}
            headline={profilePublic?.headline}
            aboutMe={profilePublic?.aboutMe}
            isOpenToWork={profilePublic?.isOpenToWork ?? false}
            profileImageUrl={profilePublic?.profileImageUrl}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title={t('profile.education')} />
        </CardHeader>
        <CardContent>
          <EducationList educations={educations} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title={t('profile.skills')} />
        </CardHeader>
        <CardContent>
          <SkillBadges skills={profileSkills} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title={t('profile.experience')} />
        </CardHeader>
        <CardContent>
          <CareerList careers={careers} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title={t('profile.certification')} />
        </CardHeader>
        <CardContent>
          <CertificationList certifications={certifications} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title={t('profile.languages')} />
        </CardHeader>
        <CardContent>
          <LanguageList languages={languages} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title={t('profile.portfolio')} />
        </CardHeader>
        <CardContent>
          <UrlList urls={urls} />
        </CardContent>
      </Card>
    </div>
  );
}
