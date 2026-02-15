import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/section-title';
import { ProfileCard } from '@/entities/profile/ui/profile-card';
import { getMyApplications } from '@/lib/actions/applications';
import { getProfileBySlug } from '@/lib/actions/profile';
import { getCurrentUser } from '@/lib/infrastructure/auth-utils';
import { getServerI18n } from '@/lib/i18n/server';
import { getActionErrorMessage } from '@/lib/i18n/action-error';

export default async function CandidateLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { t } = await getServerI18n();
  const { slug } = await params;
  const [profileResult, currentUser] = await Promise.all([
    getProfileBySlug(slug),
    getCurrentUser(),
  ]);

  if ('errorCode' in profileResult) {
    return (
      <p className="p-6 text-destructive">
        {getActionErrorMessage(profileResult, t)}
      </p>
    );
  }

  const { id, authUser, profilePublic } = profileResult.data;
  const isOwner = currentUser?.userId === id;

  let appliedCount = 0;
  let inProgressCount = 0;

  if (isOwner) {
    const applicationsResult = await getMyApplications();
    if ('success' in applicationsResult) {
      appliedCount = applicationsResult.data.filter(
        (item) => item.status === 'applied'
      ).length;
      inProgressCount = applicationsResult.data.filter(
        (item) => item.status === 'accepted'
      ).length;
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8">
      <Card>
        <CardHeader>
          <SectionTitle title={t('profile.myProfile')} />
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

      {isOwner && (
        <Card>
          <CardHeader>
            <SectionTitle title={t('profile.myJobs')} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="bg-neutral-50 rounded-[20px] px-10 py-8 text-center">
                <p className="text-xl font-bold text-[#1a1a1a]">
                  {t('profile.applied')}
                </p>
                <p className="text-xl font-bold text-[#1a1a1a]">
                  {appliedCount}
                </p>
              </div>
              <div className="bg-neutral-50 rounded-[20px] px-10 py-8 text-center">
                <p className="text-xl font-bold text-[#4c4c4c]">
                  {t('profile.inProgress')}
                </p>
                <p className="text-xl font-bold text-[#4c4c4c]">
                  {inProgressCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
