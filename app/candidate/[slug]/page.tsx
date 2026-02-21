import { ProfileCard } from '@/frontend/entities/profile/ui/profile-card';
import { getMyApplications } from '@/backend/actions/applications';
import { getProfileBySlug } from '@/backend/actions/profile';
import { getCurrentUser } from '@/backend/infrastructure/auth-utils';
import { getServerI18n } from '@/shared/i18n/server';
import { getActionErrorMessage } from '@/shared/i18n/action-error';

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
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[40px] px-6 py-8">
      <section className="flex flex-col gap-[10px]">
        <h2 className="text-[26px] leading-[1.5] font-bold text-[#1a1a1a]">
          {t('profile.myProfile')}
        </h2>
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
      </section>

      {isOwner && (
        <section className="flex flex-col gap-[20px]">
          <h2 className="text-[26px] leading-[1.5] font-bold text-[#1a1a1a]">
            {t('profile.myJobs')}
          </h2>
          <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
            <div className="rounded-[20px] bg-[#fbfbfb] px-10 py-[50px] text-center">
              <p className="text-[22px] leading-[1.5] font-bold text-[#1a1a1a]">
                {t('profile.applied')}
              </p>
              <p className="text-[22px] leading-[1.5] font-bold text-[#1a1a1a]">
                {appliedCount}
              </p>
            </div>
            <div className="rounded-[20px] bg-[#fbfbfb] px-10 py-[50px] text-center">
              <p className="text-[22px] leading-[1.5] font-bold text-[#333]">
                {t('profile.inProgress')}
              </p>
              <p className="text-[22px] leading-[1.5] font-bold text-[#333]">
                {inProgressCount}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
