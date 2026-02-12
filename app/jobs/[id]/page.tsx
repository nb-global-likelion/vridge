import { getJobDescriptionById } from '@/lib/actions/jd-queries';
import { JdDetail } from '@/entities/job/ui/jd-detail';
import { LoginToApplyCta } from './_login-to-apply-cta';

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

export default async function PublicJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getJobDescriptionById(id);

  if ('error' in result) {
    return <p className="p-6 text-destructive">{result.error}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <JdDetail {...mapJdDetail(result.data)}>
        <LoginToApplyCta />
      </JdDetail>
    </div>
  );
}
