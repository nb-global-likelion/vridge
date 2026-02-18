/** @jest-environment node */

import {
  assertSeedCoverage,
  buildCanonicalUsers,
  buildGeneratedAnnouncements,
  buildGeneratedJobDescriptions,
  buildGeneratedUsers,
  buildJobDescriptionMarkdown,
  type SampleAnnouncementSeed,
  type SampleApplySeed,
  type SampleJobDescriptionSeed,
  type SampleUserSeed,
} from '@/prisma/seed-builders';

describe('seed-builders', () => {
  const orgId = '00000000-0000-0000-0000-000000000101';
  const canonicalPassword = '@Aaa111';
  const jobIds = ['frontend-engineer', 'backend-engineer', 'product-manager'];
  const skillIds = ['typescript', 'react', 'nodejs', 'sql', 'communication'];

  const baseJobDescriptions: SampleJobDescriptionSeed[] = [
    {
      id: '00000000-0000-0000-0000-000000000401',
      orgId,
      jobId: 'frontend-engineer',
      title: 'Frontend Engineer',
      status: 'recruiting',
      employmentType: 'full_time',
      workArrangement: 'remote',
      salaryPeriod: 'month',
      salaryIsNegotiable: false,
      minEducation: 'higher_bachelor',
      descriptionMarkdown: 'placeholder',
      skillIds: ['typescript', 'react'],
    },
    {
      id: '00000000-0000-0000-0000-000000000402',
      orgId,
      jobId: 'backend-engineer',
      title: 'Backend Engineer',
      status: 'done',
      employmentType: 'intern',
      workArrangement: 'onsite',
      salaryPeriod: 'year',
      salaryIsNegotiable: true,
      minEducation: undefined,
      descriptionMarkdown: 'placeholder',
      skillIds: ['nodejs', 'sql'],
    },
  ];

  const baseAnnouncements: SampleAnnouncementSeed[] = [
    {
      id: '00000000-0000-0000-0000-000000003101',
      title: '안내 1',
      content: '공지 본문 1',
      isPinned: true,
    },
    {
      id: '00000000-0000-0000-0000-000000003102',
      title: '안내 2',
      content: '공지 본문 2',
      isPinned: false,
    },
  ];

  const baseUsers: SampleUserSeed[] = [
    ...buildCanonicalUsers({
      orgId,
      password: canonicalPassword,
    }),
    {
      id: '00000000-0000-0000-0000-000000000302',
      name: 'Anh Nguyen',
      email: 'anh.nguyen@example.com',
      role: 'candidate',
      emailVerified: true,
      seedPassword: canonicalPassword,
      profile: {
        public: {
          firstName: 'Anh',
          lastName: 'Nguyen',
          aboutMe: 'Backend engineer',
          isPublic: true,
          isOpenToWork: true,
          dateOfBirth: '1996-02-21',
        },
        private: {
          phoneNumber: '+84-90-555-0202',
        },
        careers: [
          {
            id: '00000000-0000-0000-0000-000000002101',
            companyName: 'Saigon Data Works',
            positionTitle: 'Backend Engineer',
            jobId: 'backend-engineer',
            employmentType: 'full_time',
            startDate: '2020-06-01',
            endDate: undefined,
            experienceLevel: 'MID',
          },
        ],
        educations: [
          {
            id: '00000000-0000-0000-0000-000000002201',
            institutionName: 'HCMUT',
            educationType: 'higher_bachelor',
            graduationStatus: 'GRADUATED',
            startDate: '2015-09-01',
            endDate: '2019-06-30',
          },
        ],
        languages: [
          {
            id: '00000000-0000-0000-0000-000000002301',
            language: 'Vietnamese',
            proficiency: 'native',
          },
        ],
        urls: [
          {
            id: '00000000-0000-0000-0000-000000002401',
            label: 'LinkedIn',
            url: 'https://www.linkedin.com/in/anh-demo',
          },
        ],
        certifications: [],
        attachments: [],
        skillIds: ['nodejs', 'sql'],
      },
    },
  ];

  it('JD 마크다운은 필수 섹션을 포함한다', () => {
    const markdown = buildJobDescriptionMarkdown({
      title: 'Frontend Engineer',
      companyName: 'Vridge Demo Org',
      index: 1,
    });

    expect(markdown).toContain('## About Us');
    expect(markdown).toContain('## Responsibilities');
    expect(markdown).toContain('## Required Qualifications');
    expect(markdown).toContain('## Preferred Qualifications');
    expect(markdown).toContain('- ');
  });

  it('목표 건수에 맞춰 생성 데이터를 만든다', () => {
    const generatedUsers = buildGeneratedUsers({
      baseUsers,
      targetUserCount: 20,
      orgId,
      seedPassword: canonicalPassword,
      jobIds,
      skillIds,
    });
    const generatedJds = buildGeneratedJobDescriptions({
      baseJobDescriptions,
      targetJobDescriptionCount: 1000,
      orgId,
      jobIds,
      skillIds,
    });
    const generatedAnnouncements = buildGeneratedAnnouncements({
      baseAnnouncements,
      targetAnnouncementCount: 100,
    });

    expect(baseUsers.length + generatedUsers.length).toBe(20);
    expect(baseJobDescriptions.length + generatedJds.length).toBe(1000);
    expect(baseAnnouncements.length + generatedAnnouncements.length).toBe(100);
  });

  it('정식 credential 계정 매핑을 반환한다', () => {
    const canonicalUsers = buildCanonicalUsers({
      orgId,
      password: canonicalPassword,
    });

    expect(
      canonicalUsers.map(({ email, seedPassword, role }) => ({
        email,
        seedPassword,
        role,
      }))
    ).toEqual([
      {
        email: 'candidate@likelion.net',
        seedPassword: '@Aaa111',
        role: 'candidate',
      },
      {
        email: 'recruiter@likelion.net',
        seedPassword: '@Aaa111',
        role: 'recruiter',
      },
      {
        email: 'likelion@likelion.net',
        seedPassword: '@Aaa111',
        role: 'admin',
      },
    ]);
  });

  it('coverage 검증을 통과한다', () => {
    const generatedUsers = buildGeneratedUsers({
      baseUsers,
      targetUserCount: 20,
      orgId,
      seedPassword: canonicalPassword,
      jobIds,
      skillIds,
    });
    const generatedJds = buildGeneratedJobDescriptions({
      baseJobDescriptions,
      targetJobDescriptionCount: 1000,
      orgId,
      jobIds,
      skillIds,
    });
    const generatedAnnouncements = buildGeneratedAnnouncements({
      baseAnnouncements,
      targetAnnouncementCount: 100,
    });
    const applies: SampleApplySeed[] = [
      {
        userId: baseUsers[0].id,
        jdId: baseJobDescriptions[0].id,
        status: 'applied',
      },
      {
        userId: baseUsers[0].id,
        jdId: baseJobDescriptions[1].id,
        status: 'accepted',
      },
      {
        userId: baseUsers[3].id,
        jdId: baseJobDescriptions[0].id,
        status: 'rejected',
      },
      {
        userId: generatedUsers[0].id,
        jdId: generatedJds[0].id,
        status: 'withdrawn',
      },
    ];

    const report = assertSeedCoverage({
      users: [...baseUsers, ...generatedUsers],
      jobDescriptions: [...baseJobDescriptions, ...generatedJds],
      announcements: [...baseAnnouncements, ...generatedAnnouncements],
      applies,
    });

    expect(report.missing).toHaveLength(0);
  });
});
