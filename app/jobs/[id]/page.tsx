import { headers } from 'next/headers';
import ReactMarkdown from 'react-markdown';
import { auth } from '@/lib/infrastructure/auth';
import { getJobDescriptionById } from '@/lib/actions/jd-queries';
import { getMyApplications } from '@/lib/actions/applications';
import { PostingTitle } from '@/entities/job/ui/posting-title';
import { SummaryCard } from '@/entities/job/ui/summary-card';
import { ApplyButton } from '@/features/apply/ui/apply-button';
import { LoginToApplyCta } from './_login-to-apply-cta';
import { ShareJobButton } from './_share-job-button';
import { getServerI18n } from '@/lib/i18n/server';
import { getActionErrorMessage } from '@/lib/i18n/action-error';
import { getLocalizedCatalogName } from '@/lib/i18n/catalog';
import { getWorkArrangementLabel } from '@/lib/frontend/presentation';

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
          <div className="w-full rounded-[20px] bg-[#fbfbfb] px-[40px] py-[20px]">
            <div className="prose prose-sm max-w-none text-[#4c4c4c]">
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
