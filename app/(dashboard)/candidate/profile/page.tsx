import Link from 'next/link';
import { Button } from '@/frontend/components/ui/button';
import { getMyProfile } from '@/backend/actions/profile';
import { requireUser } from '@/backend/infrastructure/auth-utils';
import { getServerI18n } from '@/shared/i18n/server';
import { getActionErrorMessage } from '@/shared/i18n/action-error';
import { CandidateProfileContent } from './profile-content';

export default async function CandidateProfilePage() {
  const { locale, t } = await getServerI18n();
  const user = await requireUser();
  const result = await getMyProfile();

  if ('errorCode' in result) {
    return (
      <p className="p-6 text-destructive">{getActionErrorMessage(result, t)}</p>
    );
  }

  return (
    <>
      <CandidateProfileContent
        data={result.data}
        email={user.email}
        locale={locale}
        t={t}
      />

      <div className="fixed inset-x-0 bottom-0 z-40 h-[81px] bg-white/80 px-[40px] py-[10px] shadow-[0_-4px_40px_0_rgba(0,0,0,0.04)] backdrop-blur-[5.7px]">
        <div className="mx-auto flex h-full w-full max-w-[1200px] items-end justify-end">
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
