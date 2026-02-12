import { requireUser } from '@/lib/infrastructure/auth-utils';
import { getJobDescriptionById } from '@/lib/actions/jd-queries';
import { getMyApplications } from '@/lib/actions/applications';
import { JdDetail } from '@/entities/job/ui/jd-detail';
import { ApplyButton } from '@/features/apply/ui/apply-button';

type JdData = Extract<
  Awaited<ReturnType<typeof getJobDescriptionById>>,
  { success: true }
>['data'];

function mapJdDetail(jd: JdData) {
  return {
    title: jd.title,
    orgName: jd.org?.name,
    jobDisplayNameEn: jd.job.displayNameEn,
    jobFamilyDisplayNameEn: jd.job.family.displayNameEn,
    employmentType: jd.employmentType,
    workArrangement: jd.workArrangement,
    salaryMin: jd.salaryMin,
    salaryMax: jd.salaryMax,
    salaryCurrency: jd.salaryCurrency,
    salaryPeriod: jd.salaryPeriod,
    salaryIsNegotiable: jd.salaryIsNegotiable,
    descriptionMarkdown: jd.descriptionMarkdown,
    skills: jd.skills,
  };
}

export default async function DashboardJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUser();

  const [jdResult, myAppsResult] = await Promise.all([
    getJobDescriptionById(id),
    getMyApplications(),
  ]);

  if ('error' in jdResult) {
    return <p className="p-6 text-destructive">{jdResult.error}</p>;
  }

  const myApply = !('error' in myAppsResult)
    ? myAppsResult.data.find((a) => a.jdId === id)
    : undefined;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <JdDetail {...mapJdDetail(jdResult.data)}>
        <ApplyButton
          jdId={id}
          initialApplied={!!myApply}
          applyId={myApply?.id}
        />
      </JdDetail>
    </div>
  );
}
