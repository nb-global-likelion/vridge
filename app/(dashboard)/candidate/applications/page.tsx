import { requireUser } from '@/lib/infrastructure/auth-utils';
import { getMyApplications } from '@/lib/actions/applications';
import { ApplicationStatus } from '@/entities/application/ui/application-status';
import { formatDate } from '@/entities/profile/ui/_utils';

export default async function MyApplicationsPage() {
  await requireUser();
  const result = await getMyApplications();

  if ('error' in result) {
    return <p className="p-6 text-destructive">{result.error}</p>;
  }

  const applies = result.data;

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">내 지원 목록</h1>

      {applies.length === 0 ? (
        <p className="text-muted-foreground">
          아직 지원한 채용공고가 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {applies.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded border p-4"
            >
              <div>
                <p className="font-medium">{a.jd.title}</p>
                <p className="text-sm text-muted-foreground">
                  {a.jd.org?.name ?? '-'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ApplicationStatus status={a.status} />
                <p className="text-xs text-muted-foreground">
                  {formatDate(a.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
