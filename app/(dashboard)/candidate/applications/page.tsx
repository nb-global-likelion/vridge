import { PostingListItem } from '@/frontend/entities/job/ui/posting-list-item';
import { getMyApplications } from '@/backend/actions/applications';
import { requireUser } from '@/backend/infrastructure/auth-utils';
import { getServerI18n } from '@/shared/i18n/server';
import { getActionErrorMessage } from '@/shared/i18n/action-error';
import { getLocalizedCatalogName } from '@/shared/i18n/catalog';

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
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[20px]">
      <h1 className="text-[26px] leading-[1.5] font-bold text-[#1f1d1b]">
        {t('profile.myJobs')}
      </h1>

      <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-[10px] rounded-[20px] bg-[#fbfbfb] px-[40px] py-[50px] text-center">
          <p className="text-[22px] leading-[1.5] font-bold text-[#1a1a1a]">
            {t('profile.applied')}
          </p>
          <p className="text-[22px] leading-[1.5] font-bold text-[#1a1a1a]">
            {appliedCount}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-[10px] rounded-[20px] bg-[#fbfbfb] px-[40px] py-[50px] text-center">
          <p className="text-[22px] leading-[1.5] font-bold text-[#1a1a1a]">
            {t('profile.inProgress')}
          </p>
          <p className="text-[22px] leading-[1.5] font-bold text-[#1a1a1a]">
            {inProgressCount}
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-[20px] rounded-[20px] bg-white py-[20px]">
        <h2 className="text-[26px] leading-[1.5] font-bold text-[#1f1d1b]">
          {t('profile.list')}
        </h2>

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
                minYearsExperience={apply.jd.minYearsExperience}
                minEducation={apply.jd.minEducation}
                skills={apply.jd.skills}
                createdAt={apply.createdAt}
                status={toPostingStatus(apply.status)}
                href={`/jobs/${apply.jd.id}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
