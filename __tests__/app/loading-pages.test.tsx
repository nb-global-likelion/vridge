import { render } from '@testing-library/react';
import JobsLoading from '@/app/jobs/loading';
import JobDetailLoading from '@/app/jobs/[id]/loading';
import AnnouncementsLoading from '@/app/announcements/loading';
import AnnouncementDetailLoading from '@/app/announcements/[id]/loading';
import CandidateApplicationsLoading from '@/app/(dashboard)/candidate/applications/loading';
import CandidateProfileLoading from '@/app/(dashboard)/candidate/profile/loading';

describe('route loading UI', () => {
  const cases = [
    ['jobs 목록', JobsLoading],
    ['jobs 상세', JobDetailLoading],
    ['announcements 목록', AnnouncementsLoading],
    ['announcements 상세', AnnouncementDetailLoading],
    ['candidate applications', CandidateApplicationsLoading],
    ['candidate profile', CandidateProfileLoading],
  ] as const;

  it.each(cases)('%s loading이 스켈레톤을 렌더링한다', (_, Component) => {
    const { container } = render(<Component />);
    expect(
      container.querySelector('[data-slot="skeleton"]')
    ).toBeInTheDocument();
  });
});
