import { headers } from 'next/headers';
import ReactMarkdown from 'react-markdown';
import { auth } from '@/lib/infrastructure/auth';
import { getJobDescriptionById } from '@/lib/actions/jd-queries';
import { getMyApplications } from '@/lib/actions/applications';
import { PostingTitle } from '@/entities/job/ui/posting-title';
import { SummaryCard } from '@/entities/job/ui/summary-card';
import { ApplyButton } from '@/features/apply/ui/apply-button';
import { LoginToApplyCta } from './_login-to-apply-cta';
import { getServerI18n } from '@/lib/i18n/server';
import { getActionErrorMessage } from '@/lib/i18n/action-error';
import { getLocalizedCatalogName } from '@/lib/i18n/catalog';

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
    <ApplyButton jdId={id} initialApplied={!!myApply} applyId={myApply?.id} />
  ) : (
    <LoginToApplyCta />
  );

  return (
    <div className="mx-auto flex max-w-5xl gap-8 px-6 py-8">
      <div className="flex flex-1 flex-col gap-6">
        <PostingTitle
          title={jd.title}
          status="recruiting"
          createdAt={jd.createdAt}
        />

        {jd.descriptionMarkdown && (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{jd.descriptionMarkdown}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="sticky top-6 hidden self-start lg:block">
        <SummaryCard
          jobDisplayName={getLocalizedCatalogName(jd.job, locale)}
          employmentType={jd.employmentType}
          workArrangement={jd.workArrangement}
          skills={jd.skills}
          cta={cta}
        />
      </div>
    </div>
  );
}
