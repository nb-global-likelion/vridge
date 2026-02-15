import { redirect } from 'next/navigation';
import { getMyProfile } from '@/lib/actions/profile';
import { requireUser } from '@/lib/infrastructure/auth-utils';
import { getServerI18n } from '@/lib/i18n/server';
import { getActionErrorMessage } from '@/lib/i18n/action-error';

export default async function CandidateProfilePage() {
  const { t } = await getServerI18n();
  await requireUser();
  const result = await getMyProfile();

  if ('errorCode' in result) {
    return (
      <p className="text-destructive">{getActionErrorMessage(result, t)}</p>
    );
  }

  const slug = result.data.profilePublic?.publicSlug;
  if (!slug) {
    return <p className="text-destructive">{t('profile.slugMissing')}</p>;
  }

  redirect(`/candidate/${slug}/profile`);
}
