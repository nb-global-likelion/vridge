import { SectionTitle } from '@/components/ui/section-title';
import { PostingListItem } from '@/entities/job/ui/posting-list-item';
import { getMyApplications } from '@/lib/actions/applications';
import { requireUser } from '@/lib/infrastructure/auth-utils';
import { getServerI18n } from '@/lib/i18n/server';
import { getActionErrorMessage } from '@/lib/i18n/action-error';
import { getLocalizedCatalogName } from '@/lib/i18n/catalog';

function toPostingStatus(status: string): 'recruiting' | 'done' {
  if (status === 'rejected' || status === 'withdrawn') return 'done';
  return 'recruiting';
}

export default async function MyApplicationsPage() {
  const { locale, t } = await getServerI18n();
  await requireUser();
  const result = await getMyApplications();

  if ('errorCode' in result) {
    return (
      <p className="p-6 text-destructive">{getActionErrorMessage(result, t)}</p>
    );
  }

  const applications = result.data;
  const appliedCount = applications.filter(
    (item) => item.status === 'applied'
  ).length;
  const inProgressCount = applications.filter(
    (item) => item.status === 'accepted'
  ).length;

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <SectionTitle title={t('profile.myJobs')} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="bg-neutral-50 rounded-[20px] px-10 py-8 text-center">
          <p className="text-xl font-bold text-[#1a1a1a]">
            {t('profile.applied')}
          </p>
          <p className="text-xl font-bold text-[#1a1a1a]">{appliedCount}</p>
        </div>
        <div className="bg-neutral-50 rounded-[20px] px-10 py-8 text-center">
          <p className="text-xl font-bold text-[#4c4c4c]">
            {t('profile.inProgress')}
          </p>
          <p className="text-xl font-bold text-[#4c4c4c]">{inProgressCount}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionTitle title={t('profile.list')} />

        {applications.length === 0 ? (
          <p className="text-muted-foreground">{t('jobs.empty')}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {applications.map((apply) => (
              <PostingListItem
                key={apply.id}
                id={apply.jd.id}
                title={apply.jd.title}
                orgName={apply.jd.org?.name}
                jobDisplayName={getLocalizedCatalogName(apply.jd.job, locale)}
                employmentType={apply.jd.employmentType}
                workArrangement={apply.jd.workArrangement}
                skills={apply.jd.skills}
                createdAt={apply.createdAt}
                status={toPostingStatus(apply.status)}
                href={`/jobs/${apply.jd.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
