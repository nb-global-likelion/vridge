import { headers } from 'next/headers';
import ReactMarkdown from 'react-markdown';
import { auth } from '@/backend/infrastructure/auth';
import { getJobDescriptionById } from '@/backend/actions/jd-queries';
import { getMyApplications } from '@/backend/actions/applications';
import { PostingTitle } from '@/frontend/entities/job/ui/posting-title';
import { SummaryCard } from '@/frontend/entities/job/ui/summary-card';
import { ApplyButton } from '@/frontend/features/apply/ui/apply-button';
import { LoginToApplyCta } from './_login-to-apply-cta';
import { ShareJobButton } from './_share-job-button';
import { JobDetailAnalytics } from './_job-detail-analytics';
import { getServerI18n } from '@/shared/i18n/server';
import { getActionErrorMessage } from '@/shared/i18n/action-error';
import { getLocalizedCatalogName } from '@/shared/i18n/catalog';
import { getWorkArrangementLabel } from '@/frontend/lib/presentation';

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { locale, t } = await getServerI18n();
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [jdResult, myAppsResult] = await Promise.all([
    getJobDescriptionById(id),
    session ? getMyApplications() : Promise.resolve(null),
  ]);

  if ('errorCode' in jdResult) {
    return (
      <p className="p-6 text-destructive">
        {getActionErrorMessage(jdResult, t)}
      </p>
    );
  }

  const jd = jdResult.data;
  const myApply =
    myAppsResult && !('errorCode' in myAppsResult)
      ? myAppsResult.data.find((a) => a.jdId === id)
      : undefined;

  const cta = session ? (
    <ApplyButton
      jdId={id}
      initialApplied={!!myApply}
      applyId={myApply?.id}
      allowWithdraw={false}
    />
  ) : (
    <LoginToApplyCta />
  );

  return (
    <div className="mx-auto flex w-full max-w-[1200px] items-start gap-[25px] px-6 pt-[20px] pb-[120px]">
      <JobDetailAnalytics jdId={jd.id} locale={locale} />
      <div className="flex min-w-0 flex-1 flex-col gap-[40px]">
        <PostingTitle
          title={jd.title}
          company={jd.org?.name}
          jobDisplayName={getLocalizedCatalogName(jd.job, locale)}
          workArrangement={getWorkArrangementLabel(jd.workArrangement, t)}
          minYearsExperience={jd.minYearsExperience}
          status="recruiting"
          createdAt={jd.createdAt}
          backHref="/jobs"
        />

        {jd.descriptionMarkdown && (
          <div className="w-full rounded-[20px] bg-bg px-[40px] pt-[20px] pb-[40px]">
            <div className="text-body-1 text-text-body-2 [&_h2]:mb-[40px] [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:pb-[10px] [&_h2]:text-h2 [&_h2]:text-text-title-2 [&_h2:not(:first-of-type)]:mt-[80px] [&_li]:mb-[4px] [&_li:last-child]:mb-0 [&_p]:m-0 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-[27px]">
              <ReactMarkdown>{jd.descriptionMarkdown}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className="sticky top-6 hidden self-start lg:block">
        <SummaryCard
          jobDisplayName={getLocalizedCatalogName(jd.job, locale)}
          employmentType={jd.employmentType}
          workArrangement={jd.workArrangement}
          minYearsExperience={jd.minYearsExperience}
          minEducation={jd.minEducation}
          skills={jd.skills}
          cta={cta}
          secondaryAction={<ShareJobButton title={jd.title} />}
        />
      </div>
    </div>
  );
}
