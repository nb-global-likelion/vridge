export type AppRole = 'candidate' | 'recruiter' | 'admin';
export type EmploymentType = 'full_time' | 'part_time' | 'intern' | 'freelance';
export type WorkArrangement = 'onsite' | 'hybrid' | 'remote';
export type JobPostingStatus = 'recruiting' | 'done';
export type LanguageProficiency =
  | 'native'
  | 'fluent'
  | 'professional'
  | 'basic';
export type EducationTypeVn =
  | 'vet_elementary'
  | 'vet_intermediate'
  | 'vet_college'
  | 'higher_bachelor'
  | 'higher_master'
  | 'higher_doctorate'
  | 'continuing_education'
  | 'international_program'
  | 'other';
export type AttachmentType = 'pdf' | 'doc' | 'docx' | 'png' | 'jpg' | 'jpeg';
export type ApplyStatus = 'applied' | 'accepted' | 'rejected' | 'withdrawn';
export type ExperienceLevel = 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';
export type GraduationStatus =
  | 'ENROLLED'
  | 'ON_LEAVE'
  | 'GRADUATED'
  | 'EXPECTED'
  | 'WITHDRAWN';
export type SalaryPeriod = 'year' | 'month' | 'hour';

export interface SampleJobDescriptionSeed {
  id: string;
  orgId?: string;
  jobId: string;
  title: string;
  status?: JobPostingStatus;
  employmentType: EmploymentType;
  workArrangement: WorkArrangement;
  minYearsExperience?: number;
  minEducation?: EducationTypeVn;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: SalaryPeriod;
  salaryIsNegotiable?: boolean;
  descriptionMarkdown?: string;
  skillIds: string[];
}

export interface SampleProfileSeed {
  public: {
    firstName: string;
    lastName: string;
    aboutMe?: string;
    isPublic?: boolean;
    isOpenToWork?: boolean;
    dateOfBirth?: string;
    location?: string;
    profileImageUrl?: string;
  };
  private: {
    phoneNumber?: string;
  };
  careers: Array<{
    id: string;
    companyName: string;
    positionTitle: string;
    jobId: string;
    employmentType: EmploymentType;
    startDate: string;
    endDate?: string;
    description?: string;
    experienceLevel?: ExperienceLevel;
    sortOrder?: number;
  }>;
  educations: Array<{
    id: string;
    institutionName: string;
    educationType: EducationTypeVn;
    field?: string;
    graduationStatus?: GraduationStatus;
    startDate: string;
    endDate?: string;
    sortOrder?: number;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: LanguageProficiency;
    testName?: string;
    testScore?: string;
    sortOrder?: number;
  }>;
  urls: Array<{
    id: string;
    label: string;
    url: string;
    sortOrder?: number;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    date: string;
    description?: string;
    institutionName?: string;
    sortOrder?: number;
  }>;
  attachments?: Array<{
    id: string;
    label?: string;
    fileType: AttachmentType;
    mimeType: string;
    sizeBytes: number;
    originalFileName: string;
    s3Bucket: string;
    s3Key: string;
  }>;
  skillIds: string[];
}

export interface SampleUserSeed {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  orgId?: string;
  seedPassword?: string;
  emailVerified?: boolean;
  profile?: SampleProfileSeed;
}

export interface SampleApplySeed {
  userId: string;
  jdId: string;
  status?: ApplyStatus;
}

export interface SampleAnnouncementSeed {
  id: string;
  title: string;
  content: string;
  isPinned?: boolean;
}

export interface SeedBuildConfig {
  targetUserCount: number;
  targetJobDescriptionCount: number;
  targetAnnouncementCount: number;
}

export interface GeneratedSeedDataset {
  users: SampleUserSeed[];
  jobDescriptions: SampleJobDescriptionSeed[];
  announcements: SampleAnnouncementSeed[];
  applies: SampleApplySeed[];
}

export interface CoverageReport {
  passed: boolean;
  missing: string[];
}

interface BuildGeneratedUsersParams {
  baseUsers: SampleUserSeed[];
  targetUserCount: number;
  orgId: string;
  seedPassword: string;
  jobIds: string[];
  skillIds: string[];
}

interface BuildGeneratedJdParams {
  baseJobDescriptions: SampleJobDescriptionSeed[];
  targetJobDescriptionCount: number;
  orgId: string;
  jobIds: string[];
  skillIds: string[];
}

interface BuildGeneratedAnnouncementsParams {
  baseAnnouncements: SampleAnnouncementSeed[];
  targetAnnouncementCount: number;
}

export function buildCanonicalUsers(params: {
  orgId: string;
  password: string;
}): SampleUserSeed[] {
  const { orgId, password } = params;

  return [
    {
      id: '00000000-0000-0000-0000-000000000301',
      name: 'Candidate Demo',
      email: 'candidate@likelion.net',
      role: 'candidate',
      seedPassword: password,
      emailVerified: true,
      profile: {
        public: {
          firstName: 'Minji',
          lastName: 'Kim',
          aboutMe:
            'Frontend engineer focused on React and product UX in B2B web apps.',
          isPublic: true,
          isOpenToWork: true,
          dateOfBirth: '1996-03-07',
          location: 'Seoul',
        },
        private: {
          phoneNumber: '+82-10-5555-0101',
        },
        careers: [
          {
            id: '00000000-0000-0000-0000-000000001101',
            companyName: 'Orbit Labs',
            positionTitle: 'Frontend Engineer',
            jobId: 'frontend-engineer',
            employmentType: 'full_time',
            startDate: '2021-03-01',
            description:
              'Built dashboards and application workflows with Next.js.',
            experienceLevel: 'SENIOR',
            sortOrder: 1,
          },
        ],
        educations: [
          {
            id: '00000000-0000-0000-0000-000000001201',
            institutionName: 'Seoul National University',
            educationType: 'higher_bachelor',
            field: 'Computer Science',
            graduationStatus: 'GRADUATED',
            startDate: '2016-03-01',
            endDate: '2020-02-28',
            sortOrder: 1,
          },
        ],
        languages: [
          {
            id: '00000000-0000-0000-0000-000000001301',
            language: 'Korean',
            proficiency: 'native',
            sortOrder: 1,
          },
          {
            id: '00000000-0000-0000-0000-000000001302',
            language: 'English',
            proficiency: 'professional',
            sortOrder: 2,
          },
        ],
        urls: [
          {
            id: '00000000-0000-0000-0000-000000001401',
            label: 'GitHub',
            url: 'https://github.com/minji-demo',
            sortOrder: 1,
          },
        ],
        certifications: [
          {
            id: '00000000-0000-0000-0000-000000001501',
            name: 'AWS Certified Developer - Associate',
            date: '2023-06-15',
            institutionName: 'Amazon Web Services',
            description: 'Associate-level certification for cloud development.',
            sortOrder: 1,
          },
        ],
        skillIds: [
          'typescript',
          'react',
          'nextjs',
          'tailwindcss',
          'communication',
        ],
      },
    },
    {
      id: '00000000-0000-0000-0000-000000000201',
      name: 'Recruiter Demo',
      email: 'recruiter@likelion.net',
      role: 'recruiter',
      orgId,
      seedPassword: password,
      emailVerified: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000202',
      name: 'Admin Demo',
      email: 'likelion@likelion.net',
      role: 'admin',
      orgId,
      seedPassword: password,
      emailVerified: true,
    },
  ];
}

export function buildJobDescriptionMarkdown(params: {
  title: string;
  companyName: string;
  index: number;
}): string {
  const { title, companyName, index } = params;

  return [
    '## About Us',
    `${companyName} is building practical ATS workflows for hiring teams. This role (${title}) joins a cross-functional group focused on product quality and delivery consistency.`,
    '## Responsibilities',
    '- Build and deliver scoped roadmap items with clear ownership.',
    '- Collaborate with design, product, and QA to maintain release quality.',
    '- Document implementation decisions and handoff context to teammates.',
    '## Required Qualifications',
    '- Demonstrated experience shipping production features.',
    '- Strong communication skills with stakeholders across functions.',
    '- Ability to debug issues and drive them to root cause resolution.',
    '## Preferred Qualifications',
    '- Experience in recruiting, HR, or ATS-related domain workflows.',
    '- Familiarity with analytics instrumentation and experiment design.',
    `- Interest in mentoring peers and improving team standards (seed #${index}).`,
  ].join('\n\n');
}

export function buildGeneratedUsers(
  params: BuildGeneratedUsersParams
): SampleUserSeed[] {
  const { baseUsers, targetUserCount, orgId, seedPassword, jobIds, skillIds } =
    params;
  const generatedCount = Math.max(targetUserCount - baseUsers.length, 0);

  if (generatedCount === 0) return [];
  if (jobIds.length === 0) throw new Error('jobIds must not be empty');
  if (skillIds.length === 0) throw new Error('skillIds must not be empty');

  const employmentTypes: EmploymentType[] = [
    'full_time',
    'part_time',
    'intern',
    'freelance',
  ];
  const languageProficiencies: LanguageProficiency[] = [
    'native',
    'fluent',
    'professional',
    'basic',
  ];
  const educationTypes: EducationTypeVn[] = [
    'vet_elementary',
    'vet_intermediate',
    'vet_college',
    'higher_bachelor',
    'higher_master',
    'higher_doctorate',
    'continuing_education',
    'international_program',
    'other',
  ];
  const graduationStatuses: GraduationStatus[] = [
    'ENROLLED',
    'ON_LEAVE',
    'GRADUATED',
    'EXPECTED',
    'WITHDRAWN',
  ];
  const experienceLevels: Array<ExperienceLevel | undefined> = [
    'ENTRY',
    'JUNIOR',
    'MID',
    'SENIOR',
    'LEAD',
    undefined,
  ];
  const attachmentTypes: AttachmentType[] = [
    'pdf',
    'doc',
    'docx',
    'png',
    'jpg',
    'jpeg',
  ];

  return Array.from({ length: generatedCount }, (_, index) => {
    const n = index + 1;
    const phoneSuffix = `${5000 + n}`.padStart(4, '0');
    const skillWindow = [0, 1, 2]
      .map((offset) => skillIds[(index + offset) % skillIds.length])
      .filter((value, idx, arr) => arr.indexOf(value) === idx);
    const educationType = educationTypes[index % educationTypes.length];
    const employmentType = employmentTypes[index % employmentTypes.length];
    const languageProficiency =
      languageProficiencies[index % languageProficiencies.length];
    const graduationStatus =
      graduationStatuses[index % graduationStatuses.length];
    const experienceLevel = experienceLevels[index % experienceLevels.length];
    const attachmentType =
      index < attachmentTypes.length ? attachmentTypes[index] : undefined;

    return {
      id: deterministicUuid('0000c001', n),
      name: `Seed Candidate ${n}`,
      email: `seed.candidate${n}@likelion.net`,
      role: 'candidate',
      seedPassword,
      emailVerified: index % 5 !== 0,
      orgId,
      profile: {
        public: {
          firstName: 'Seed',
          lastName: `Candidate${n}`,
          aboutMe: `Candidate ${n} focuses on product execution and collaboration.`,
          isPublic: index % 3 !== 0,
          isOpenToWork: index % 2 === 0,
          dateOfBirth:
            index % 2 === 0
              ? `199${index % 10}-0${(index % 8) + 1}-1${index % 9}`
              : undefined,
          location: index % 2 === 0 ? 'Seoul' : 'Ho Chi Minh City',
        },
        private: {
          phoneNumber: `+84-90-55${phoneSuffix}`,
        },
        careers: [
          {
            id: deterministicUuid('0000c101', n),
            companyName: `Demo Company ${n}`,
            positionTitle: 'Software Engineer',
            jobId: jobIds[index % jobIds.length],
            employmentType,
            startDate: `201${index % 8}-01-01`,
            endDate: index % 2 === 0 ? undefined : `202${index % 5}-12-31`,
            description: `Contributed to delivery milestones for project ${n}.`,
            experienceLevel,
            sortOrder: 1,
          },
        ],
        educations: [
          {
            id: deterministicUuid('0000c201', n),
            institutionName: `Seed University ${n}`,
            educationType,
            field: 'Computer Science',
            graduationStatus,
            startDate: `201${index % 8}-03-01`,
            endDate: index % 3 === 0 ? undefined : `202${index % 5}-02-28`,
            sortOrder: 1,
          },
        ],
        languages: [
          {
            id: deterministicUuid('0000c301', n),
            language: index % 2 === 0 ? 'English' : 'Vietnamese',
            proficiency: languageProficiency,
            sortOrder: 1,
          },
        ],
        urls: [
          {
            id: deterministicUuid('0000c401', n),
            label: 'Portfolio',
            url: `https://example.com/seed-candidate-${n}`,
            sortOrder: 1,
          },
        ],
        certifications:
          index % 2 === 0
            ? [
                {
                  id: deterministicUuid('0000c501', n),
                  name: `Seed Certificate ${n}`,
                  date: `202${index % 5}-06-15`,
                  institutionName: 'Seed Institute',
                  description: 'Certification for practical delivery skills.',
                  sortOrder: 1,
                },
              ]
            : [],
        attachments: attachmentType
          ? [
              {
                id: deterministicUuid('0000c601', n),
                label: `Attachment ${n}`,
                fileType: attachmentType,
                mimeType: resolveMimeType(attachmentType),
                sizeBytes: 1024 + index * 10,
                originalFileName: `seed-attachment-${n}.${attachmentType}`,
                s3Bucket: 'vridge-seed-local',
                s3Key: `profiles/seed-${n}/attachment.${attachmentType}`,
              },
            ]
          : [],
        skillIds: skillWindow,
      },
    };
  });
}

export function buildGeneratedJobDescriptions(
  params: BuildGeneratedJdParams
): SampleJobDescriptionSeed[] {
  const {
    baseJobDescriptions,
    targetJobDescriptionCount,
    orgId,
    jobIds,
    skillIds,
  } = params;
  const generatedCount = Math.max(
    targetJobDescriptionCount - baseJobDescriptions.length,
    0
  );

  if (generatedCount === 0) return [];
  if (jobIds.length === 0) throw new Error('jobIds must not be empty');
  if (skillIds.length === 0) throw new Error('skillIds must not be empty');

  const employmentTypes: EmploymentType[] = [
    'full_time',
    'part_time',
    'intern',
    'freelance',
  ];
  const workArrangements: WorkArrangement[] = ['onsite', 'hybrid', 'remote'];
  const statuses: JobPostingStatus[] = ['recruiting', 'done'];
  const salaryPeriods: SalaryPeriod[] = ['year', 'month', 'hour'];
  const educations: Array<EducationTypeVn | undefined> = [
    'vet_elementary',
    'vet_intermediate',
    'vet_college',
    'higher_bachelor',
    'higher_master',
    'higher_doctorate',
    'continuing_education',
    'international_program',
    'other',
    undefined,
  ];

  return Array.from({ length: generatedCount }, (_, index) => {
    const n = index + 1;
    const jobId = jobIds[index % jobIds.length];
    const skillWindow = [0, 1, 2]
      .map((offset) => skillIds[(index + offset) % skillIds.length])
      .filter((value, idx, arr) => arr.indexOf(value) === idx);

    return {
      id: deterministicUuid('0000d001', n),
      orgId,
      jobId,
      title: `Seed ${jobId} Position ${n}`,
      status: statuses[index % statuses.length],
      employmentType: employmentTypes[index % employmentTypes.length],
      workArrangement: workArrangements[index % workArrangements.length],
      minYearsExperience: (index % 8) + 1,
      minEducation: educations[index % educations.length],
      salaryMin: 1200 + index * 15,
      salaryMax: 1800 + index * 20,
      salaryCurrency: 'VND',
      salaryPeriod: salaryPeriods[index % salaryPeriods.length],
      salaryIsNegotiable: index % 2 === 0,
      descriptionMarkdown: buildJobDescriptionMarkdown({
        title: `Seed ${jobId} Position ${n}`,
        companyName: 'Vridge Demo Org',
        index: n,
      }),
      skillIds: skillWindow,
    };
  });
}

export function buildGeneratedAnnouncements(
  params: BuildGeneratedAnnouncementsParams
): SampleAnnouncementSeed[] {
  const { baseAnnouncements, targetAnnouncementCount } = params;
  const generatedCount = Math.max(
    targetAnnouncementCount - baseAnnouncements.length,
    0
  );

  return Array.from({ length: generatedCount }, (_, index) => {
    const n = index + 1;
    return {
      id: deterministicUuid('0000e001', n),
      title: `운영 공지 ${n}`,
      content: `시스템 운영 공지 ${n}입니다. 서비스 이용 안정성을 위해 순차 점검과 모니터링을 진행합니다.`,
      isPinned: n % 30 === 0,
    };
  });
}

export function assertSeedCoverage(
  dataset: GeneratedSeedDataset
): CoverageReport {
  const missing: string[] = [];

  assertEnumCoverage(
    'AppRole',
    ['candidate', 'recruiter', 'admin'],
    new Set(dataset.users.map((user) => user.role)),
    missing
  );

  assertEnumCoverage(
    'EmploymentType',
    ['full_time', 'part_time', 'intern', 'freelance'],
    new Set([
      ...dataset.jobDescriptions.map((jd) => jd.employmentType),
      ...dataset.users.flatMap((user) =>
        (user.profile?.careers ?? []).map((career) => career.employmentType)
      ),
    ]),
    missing
  );

  assertEnumCoverage(
    'WorkArrangement',
    ['onsite', 'hybrid', 'remote'],
    new Set(dataset.jobDescriptions.map((jd) => jd.workArrangement)),
    missing
  );

  assertEnumCoverage(
    'JobPostingStatus',
    ['recruiting', 'done'],
    new Set(dataset.jobDescriptions.map((jd) => jd.status ?? 'recruiting')),
    missing
  );

  assertEnumCoverage(
    'LanguageProficiency',
    ['native', 'fluent', 'professional', 'basic'],
    new Set(
      dataset.users.flatMap((user) =>
        (user.profile?.languages ?? []).map((language) => language.proficiency)
      )
    ),
    missing
  );

  assertEnumCoverage(
    'EducationTypeVn',
    [
      'vet_elementary',
      'vet_intermediate',
      'vet_college',
      'higher_bachelor',
      'higher_master',
      'higher_doctorate',
      'continuing_education',
      'international_program',
      'other',
    ],
    new Set([
      ...dataset.jobDescriptions.flatMap((jd) =>
        jd.minEducation ? [jd.minEducation] : []
      ),
      ...dataset.users.flatMap((user) =>
        (user.profile?.educations ?? []).map(
          (education) => education.educationType
        )
      ),
    ]),
    missing
  );

  assertEnumCoverage(
    'AttachmentType',
    ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'],
    new Set(
      dataset.users.flatMap((user) =>
        (user.profile?.attachments ?? []).map(
          (attachment) => attachment.fileType
        )
      )
    ),
    missing
  );

  assertEnumCoverage(
    'ApplyStatus',
    ['applied', 'accepted', 'rejected', 'withdrawn'],
    new Set(dataset.applies.map((apply) => apply.status ?? 'applied')),
    missing
  );

  assertEnumCoverage(
    'ExperienceLevel',
    ['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'],
    new Set(
      dataset.users.flatMap((user) =>
        (user.profile?.careers ?? [])
          .map((career) => career.experienceLevel)
          .filter((level): level is ExperienceLevel => Boolean(level))
      )
    ),
    missing
  );

  assertEnumCoverage(
    'GraduationStatus',
    ['ENROLLED', 'ON_LEAVE', 'GRADUATED', 'EXPECTED', 'WITHDRAWN'],
    new Set(
      dataset.users.flatMap((user) =>
        (user.profile?.educations ?? []).map(
          (education) => education.graduationStatus ?? 'ENROLLED'
        )
      )
    ),
    missing
  );

  assertEnumCoverage(
    'SalaryPeriod',
    ['year', 'month', 'hour'],
    new Set(dataset.jobDescriptions.map((jd) => jd.salaryPeriod ?? 'year')),
    missing
  );

  assertBooleanCoverage(
    'User.emailVerified',
    dataset.users.map((user) => user.emailVerified ?? true),
    missing
  );
  assertBooleanCoverage(
    'ProfilesPublic.isPublic',
    dataset.users
      .filter((user) => Boolean(user.profile))
      .map((user) => user.profile?.public.isPublic ?? true),
    missing
  );
  assertBooleanCoverage(
    'ProfilesPublic.isOpenToWork',
    dataset.users
      .filter((user) => Boolean(user.profile))
      .map((user) => user.profile?.public.isOpenToWork ?? false),
    missing
  );
  assertBooleanCoverage(
    'JobDescription.salaryIsNegotiable',
    dataset.jobDescriptions.map((jd) => jd.salaryIsNegotiable ?? false),
    missing
  );
  assertBooleanCoverage(
    'Announcement.isPinned',
    dataset.announcements.map((announcement) => announcement.isPinned ?? false),
    missing
  );

  assertNullabilityCoverage(
    'ProfilesPublic.dateOfBirth',
    dataset.users
      .filter((user) => Boolean(user.profile))
      .map((user) => user.profile?.public.dateOfBirth),
    missing
  );
  assertNullabilityCoverage(
    'ProfileCareer.endDate',
    dataset.users.flatMap((user) =>
      (user.profile?.careers ?? []).map((career) => career.endDate)
    ),
    missing
  );
  assertNullabilityCoverage(
    'ProfileCareer.experienceLevel',
    dataset.users.flatMap((user) =>
      (user.profile?.careers ?? []).map((career) => career.experienceLevel)
    ),
    missing
  );
  assertNullabilityCoverage(
    'ProfileEducation.endDate',
    dataset.users.flatMap((user) =>
      (user.profile?.educations ?? []).map((education) => education.endDate)
    ),
    missing
  );
  assertNullabilityCoverage(
    'JobDescription.minEducation',
    dataset.jobDescriptions.map((jd) => jd.minEducation),
    missing
  );

  if (missing.length > 0) {
    throw new Error(
      `Seed coverage assertion failed. Missing coverage: ${missing.join(', ')}`
    );
  }

  return {
    passed: true,
    missing: [],
  };
}

function assertEnumCoverage(
  label: string,
  expected: string[],
  values: Set<string>,
  missing: string[]
) {
  for (const value of expected) {
    if (!values.has(value)) {
      missing.push(`${label}:${value}`);
    }
  }
}

function assertBooleanCoverage(
  label: string,
  values: boolean[],
  missing: string[]
) {
  const hasTrue = values.includes(true);
  const hasFalse = values.includes(false);
  if (!hasTrue) {
    missing.push(`${label}:true`);
  }
  if (!hasFalse) {
    missing.push(`${label}:false`);
  }
}

function assertNullabilityCoverage(
  label: string,
  values: Array<string | undefined>,
  missing: string[]
) {
  const hasNonNull = values.some((value) => value !== undefined);
  const hasNull = values.some((value) => value === undefined);
  if (!hasNonNull) {
    missing.push(`${label}:non-null`);
  }
  if (!hasNull) {
    missing.push(`${label}:null`);
  }
}

function resolveMimeType(fileType: AttachmentType): string {
  switch (fileType) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpeg';
    case 'jpeg':
      return 'image/jpeg';
  }
}

function deterministicUuid(namespace: string, index: number): string {
  const normalizedNamespace = namespace
    .toLowerCase()
    .padStart(8, '0')
    .slice(0, 8);
  const tail = index.toString(16).padStart(12, '0');
  return `${normalizedNamespace}-0000-4000-8000-${tail}`;
}
