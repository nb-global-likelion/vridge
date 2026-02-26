import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { toDateOnlyUtc } from '../domain/date-only';
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
  type SeedBuildConfig,
} from './seed-builders';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

interface JobSeed {
  id: string;
  displayNameEn: string;
  displayNameKo?: string;
  displayNameVi?: string;
  sortOrder: number;
}

interface JobFamilySeed {
  id: string;
  displayNameEn: string;
  displayNameKo?: string;
  displayNameVi?: string;
  sortOrder: number;
  jobs: JobSeed[];
}

interface SkillSeed {
  id: string;
  displayNameEn: string;
  displayNameKo?: string;
  displayNameVi?: string;
  aliases: string[];
}

const SAMPLE_IDS = {
  org: '00000000-0000-0000-0000-000000000101',
  recruiter: '00000000-0000-0000-0000-000000000201',
  admin: '00000000-0000-0000-0000-000000000202',
  candidateA: '00000000-0000-0000-0000-000000000301',
  candidateB: '00000000-0000-0000-0000-000000000302',
  jdFrontend: '00000000-0000-0000-0000-000000000401',
  jdBackend: '00000000-0000-0000-0000-000000000402',
  jdProduct: '00000000-0000-0000-0000-000000000403',
  jdContentDone: '00000000-0000-0000-0000-000000000404',
} as const;

const SEED_BUILD_CONFIG: SeedBuildConfig = {
  targetUserCount: 20,
  targetJobDescriptionCount: 1000,
  targetAnnouncementCount: 100,
};

const CANONICAL_PASSWORD = '@Aaa111!';
type SeedScope = 'full' | 'prod_v0_1_core3';

function resolveSeedScope(rawScope: string | undefined): SeedScope {
  if (!rawScope) return 'full';
  if (rawScope === 'full' || rawScope === 'prod_v0_1_core3') {
    return rawScope;
  }

  console.warn(`알 수 없는 SEED_SCOPE(${rawScope})로 full 모드를 사용합니다.`);
  return 'full';
}

const BASE_SAMPLE_JOB_DESCRIPTIONS: SampleJobDescriptionSeed[] = [
  {
    id: SAMPLE_IDS.jdFrontend,
    orgId: SAMPLE_IDS.org,
    jobId: 'frontend-engineer',
    title: 'Frontend Engineer (Next.js)',
    status: 'recruiting',
    employmentType: 'full_time',
    workArrangement: 'remote',
    minYearsExperience: 2,
    minEducation: 'higher_bachelor',
    salaryMin: 30000000,
    salaryMax: 45000000,
    salaryCurrency: 'VND',
    salaryPeriod: 'month',
    salaryIsNegotiable: false,
    skillIds: ['typescript', 'react', 'nextjs', 'css'],
  },
  {
    id: SAMPLE_IDS.jdBackend,
    orgId: SAMPLE_IDS.org,
    jobId: 'backend-engineer',
    title: 'Backend Engineer (Node.js)',
    status: 'recruiting',
    employmentType: 'full_time',
    workArrangement: 'hybrid',
    minYearsExperience: 3,
    minEducation: 'higher_bachelor',
    salaryMin: 35000000,
    salaryMax: 55000000,
    salaryCurrency: 'VND',
    salaryPeriod: 'month',
    salaryIsNegotiable: true,
    skillIds: ['nodejs', 'postgresql', 'sql', 'docker', 'aws'],
  },
  {
    id: SAMPLE_IDS.jdProduct,
    orgId: SAMPLE_IDS.org,
    jobId: 'product-manager',
    title: 'Product Manager (ATS)',
    status: 'recruiting',
    employmentType: 'full_time',
    workArrangement: 'onsite',
    minYearsExperience: 4,
    minEducation: 'higher_bachelor',
    salaryMin: 40000000,
    salaryMax: 65000000,
    salaryCurrency: 'VND',
    salaryPeriod: 'month',
    salaryIsNegotiable: true,
    skillIds: ['agile', 'scrum', 'project-management', 'communication'],
  },
  {
    id: SAMPLE_IDS.jdContentDone,
    orgId: SAMPLE_IDS.org,
    jobId: 'content-marketer',
    title: 'Content Marketer',
    status: 'done',
    employmentType: 'intern',
    workArrangement: 'onsite',
    minEducation: 'higher_bachelor',
    salaryCurrency: 'VND',
    salaryPeriod: 'month',
    salaryIsNegotiable: true,
    skillIds: ['communication', 'project-management', 'agile'],
  },
];

const SAMPLE_JOB_DESCRIPTIONS: SampleJobDescriptionSeed[] =
  BASE_SAMPLE_JOB_DESCRIPTIONS.map((jd, index) => ({
    ...jd,
    descriptionMarkdown: buildJobDescriptionMarkdown({
      title: jd.title,
      companyName: 'Vridge Demo Org',
      index: index + 1,
    }),
  }));

const SAMPLE_USERS: SampleUserSeed[] = [
  ...buildCanonicalUsers({
    orgId: SAMPLE_IDS.org,
    password: CANONICAL_PASSWORD,
  }),
  {
    id: SAMPLE_IDS.candidateB,
    name: 'Anh Nguyen',
    email: 'anh.nguyen@example.com',
    role: 'candidate',
    seedPassword: CANONICAL_PASSWORD,
    emailVerified: true,
    profile: {
      public: {
        firstName: 'Anh',
        lastName: 'Nguyen',
        aboutMe:
          'Backend engineer with production experience in APIs, Postgres, and cloud deployment.',
        isPublic: true,
        isOpenToWork: false,
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
          endDate: '2025-01-31',
          description: 'Implemented API services and query optimizations.',
          experienceLevel: 'MID',
          sortOrder: 1,
        },
      ],
      educations: [
        {
          id: '00000000-0000-0000-0000-000000002201',
          institutionName: 'Ho Chi Minh City University of Technology',
          educationType: 'higher_bachelor',
          field: 'Software Engineering',
          graduationStatus: 'GRADUATED',
          startDate: '2015-09-01',
          endDate: '2019-06-30',
          sortOrder: 1,
        },
      ],
      languages: [
        {
          id: '00000000-0000-0000-0000-000000002301',
          language: 'Vietnamese',
          proficiency: 'native',
          sortOrder: 1,
        },
        {
          id: '00000000-0000-0000-0000-000000002302',
          language: 'English',
          proficiency: 'fluent',
          sortOrder: 2,
        },
      ],
      urls: [
        {
          id: '00000000-0000-0000-0000-000000002401',
          label: 'LinkedIn',
          url: 'https://www.linkedin.com/in/anh-demo',
          sortOrder: 1,
        },
      ],
      certifications: [
        {
          id: '00000000-0000-0000-0000-000000002501',
          name: 'Oracle Certified Professional, Java SE',
          date: '2022-11-10',
          institutionName: 'Oracle',
          description: 'Professional certification for Java platform skills.',
          sortOrder: 1,
        },
      ],
      attachments: [
        {
          id: '00000000-0000-0000-0000-000000002601',
          label: 'Resume',
          fileType: 'pdf',
          mimeType: 'application/pdf',
          sizeBytes: 209715,
          originalFileName: 'anh-nguyen-resume.pdf',
          s3Bucket: 'vridge-seed-local',
          s3Key: 'profiles/anh-nguyen/resume.pdf',
        },
      ],
      skillIds: ['nodejs', 'postgresql', 'docker', 'aws', 'problem-solving'],
    },
  },
];

const BASE_SAMPLE_APPLIES: SampleApplySeed[] = [
  {
    userId: SAMPLE_IDS.candidateA,
    jdId: SAMPLE_IDS.jdFrontend,
    status: 'applied',
  },
  {
    userId: SAMPLE_IDS.candidateA,
    jdId: SAMPLE_IDS.jdProduct,
    status: 'accepted',
  },
  {
    userId: SAMPLE_IDS.candidateB,
    jdId: SAMPLE_IDS.jdBackend,
    status: 'rejected',
  },
];

const SAMPLE_ANNOUNCEMENTS: SampleAnnouncementSeed[] = [
  {
    id: '00000000-0000-0000-0000-000000003101',
    title: '서비스 점검 안내',
    content:
      '2026-02-20 02:00~04:00 (KST) 동안 시스템 점검이 진행됩니다. 점검 중 일부 기능이 제한될 수 있습니다.',
    isPinned: true,
  },
  {
    id: '00000000-0000-0000-0000-000000003102',
    title: '신규 채용 공고 업데이트',
    content:
      '프론트엔드/백엔드 포지션 신규 공고가 등록되었습니다. Jobs 페이지에서 상세 내용을 확인하세요.',
    isPinned: false,
  },
];

function loadJson<T>(filename: string): T {
  const path = join(__dirname, 'seed-data', filename);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function chunkArray<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return [];

  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function buildSeedDataset(params: {
  families: JobFamilySeed[];
  skills: SkillSeed[];
}) {
  const { families, skills } = params;
  const jobIds = families.flatMap((family) => family.jobs.map((job) => job.id));
  const skillIds = skills.map((skill) => skill.id);

  const generatedUsers = buildGeneratedUsers({
    baseUsers: SAMPLE_USERS,
    targetUserCount: SEED_BUILD_CONFIG.targetUserCount,
    orgId: SAMPLE_IDS.org,
    seedPassword: CANONICAL_PASSWORD,
    jobIds,
    skillIds,
  });

  const generatedJobDescriptions = buildGeneratedJobDescriptions({
    baseJobDescriptions: SAMPLE_JOB_DESCRIPTIONS,
    targetJobDescriptionCount: SEED_BUILD_CONFIG.targetJobDescriptionCount,
    orgId: SAMPLE_IDS.org,
    jobIds,
    skillIds,
  });

  const generatedAnnouncements = buildGeneratedAnnouncements({
    baseAnnouncements: SAMPLE_ANNOUNCEMENTS,
    targetAnnouncementCount: SEED_BUILD_CONFIG.targetAnnouncementCount,
  });

  const users = [...SAMPLE_USERS, ...generatedUsers];
  const jobDescriptions = [
    ...SAMPLE_JOB_DESCRIPTIONS,
    ...generatedJobDescriptions,
  ];
  const announcements = [...SAMPLE_ANNOUNCEMENTS, ...generatedAnnouncements];
  const applies: SampleApplySeed[] = [
    ...BASE_SAMPLE_APPLIES,
    {
      userId: generatedUsers[0]?.id ?? SAMPLE_IDS.candidateB,
      jdId: SAMPLE_IDS.jdContentDone,
      status: 'withdrawn',
    },
  ];

  const coverageReport = assertSeedCoverage({
    users,
    jobDescriptions,
    announcements,
    applies,
  });

  return {
    users,
    jobDescriptions,
    announcements,
    applies,
    coverageReport,
  };
}

async function seedJobFamilies(families: JobFamilySeed[]) {
  for (const family of families) {
    const { jobs, ...familyData } = family;
    await prisma.jobFamily.upsert({
      where: { id: familyData.id },
      update: {
        displayNameEn: familyData.displayNameEn,
        displayNameKo: familyData.displayNameKo,
        displayNameVi: familyData.displayNameVi,
        sortOrder: familyData.sortOrder,
      },
      create: familyData,
    });

    for (const job of jobs) {
      await prisma.job.upsert({
        where: { id: job.id },
        update: {
          displayNameEn: job.displayNameEn,
          displayNameKo: job.displayNameKo,
          displayNameVi: job.displayNameVi,
          sortOrder: job.sortOrder,
          jobFamilyId: familyData.id,
        },
        create: {
          ...job,
          jobFamilyId: familyData.id,
        },
      });
    }
  }

  console.log(
    `시드 완료: ${families.length} families, ${families.reduce((sum, f) => sum + f.jobs.length, 0)} jobs`
  );
}

async function seedSkills(skills: SkillSeed[]) {
  for (const skill of skills) {
    const { aliases, ...skillData } = skill;
    await prisma.skill.upsert({
      where: { id: skillData.id },
      update: {
        displayNameEn: skillData.displayNameEn,
        displayNameKo: skillData.displayNameKo ?? null,
        displayNameVi: skillData.displayNameVi ?? null,
      },
      create: {
        id: skillData.id,
        displayNameEn: skillData.displayNameEn,
        displayNameKo: skillData.displayNameKo ?? null,
        displayNameVi: skillData.displayNameVi ?? null,
      },
    });

    for (const alias of aliases) {
      const normalized = alias.toLowerCase().trim();
      const existing = await prisma.skillAlias.findFirst({
        where: { skillId: skillData.id, aliasNormalized: normalized },
      });
      if (!existing) {
        await prisma.skillAlias.create({
          data: {
            skillId: skillData.id,
            alias,
            aliasNormalized: normalized,
          },
        });
      }
    }
  }

  const aliasCount = skills.reduce((sum, s) => sum + s.aliases.length, 0);
  console.log(`시드 완료: ${skills.length} skills, ${aliasCount} aliases`);
}

async function seedSampleOrg() {
  await prisma.org.upsert({
    where: { id: SAMPLE_IDS.org },
    update: { name: 'Vridge Demo Org' },
    create: { id: SAMPLE_IDS.org, name: 'Vridge Demo Org' },
  });

  console.log('시드 완료: sample org 1');
}

async function seedSampleJobDescriptions(
  jobDescriptions: SampleJobDescriptionSeed[]
) {
  for (const chunk of chunkArray(jobDescriptions, 100)) {
    for (const jd of chunk) {
      await prisma.jobDescription.upsert({
        where: { id: jd.id },
        update: {
          orgId: jd.orgId ?? null,
          jobId: jd.jobId,
          title: jd.title,
          status: jd.status ?? 'recruiting',
          employmentType: jd.employmentType,
          workArrangement: jd.workArrangement,
          minYearsExperience: jd.minYearsExperience ?? null,
          minEducation: jd.minEducation ?? null,
          salaryMin: jd.salaryMin ?? null,
          salaryMax: jd.salaryMax ?? null,
          salaryCurrency: jd.salaryCurrency ?? 'VND',
          salaryPeriod: jd.salaryPeriod ?? 'month',
          salaryIsNegotiable: jd.salaryIsNegotiable ?? false,
          descriptionMarkdown: jd.descriptionMarkdown ?? null,
        },
        create: {
          id: jd.id,
          orgId: jd.orgId ?? null,
          jobId: jd.jobId,
          title: jd.title,
          status: jd.status ?? 'recruiting',
          employmentType: jd.employmentType,
          workArrangement: jd.workArrangement,
          minYearsExperience: jd.minYearsExperience ?? null,
          minEducation: jd.minEducation ?? null,
          salaryMin: jd.salaryMin ?? null,
          salaryMax: jd.salaryMax ?? null,
          salaryCurrency: jd.salaryCurrency ?? 'VND',
          salaryPeriod: jd.salaryPeriod ?? 'month',
          salaryIsNegotiable: jd.salaryIsNegotiable ?? false,
          descriptionMarkdown: jd.descriptionMarkdown ?? null,
        },
      });

      if (jd.skillIds.length > 0) {
        await prisma.jobDescriptionSkill.deleteMany({
          where: { jdId: jd.id, skillId: { notIn: jd.skillIds } },
        });
        await prisma.jobDescriptionSkill.createMany({
          data: jd.skillIds.map((skillId) => ({ jdId: jd.id, skillId })),
          skipDuplicates: true,
        });
      } else {
        await prisma.jobDescriptionSkill.deleteMany({
          where: { jdId: jd.id },
        });
      }
    }
  }

  console.log(`시드 완료: sample jds ${jobDescriptions.length}`);
}

async function seedSampleUsers(users: SampleUserSeed[]) {
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ?? true,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ?? true,
      },
    });

    await prisma.appUser.upsert({
      where: { id: user.id },
      update: {
        orgId: user.orgId ?? null,
        role: user.role,
      },
      create: {
        id: user.id,
        orgId: user.orgId ?? null,
        role: user.role,
      },
    });

    if (!user.profile) continue;

    await prisma.profilesPublic.upsert({
      where: { userId: user.id },
      update: {
        firstName: user.profile.public.firstName,
        lastName: user.profile.public.lastName,
        aboutMe: user.profile.public.aboutMe ?? null,
        isPublic: user.profile.public.isPublic ?? true,
        dateOfBirth: user.profile.public.dateOfBirth
          ? toDateOnlyUtc(user.profile.public.dateOfBirth)
          : null,
        location: user.profile.public.location ?? null,
        isOpenToWork: user.profile.public.isOpenToWork ?? false,
        profileImageUrl: user.profile.public.profileImageUrl ?? null,
      },
      create: {
        userId: user.id,
        firstName: user.profile.public.firstName,
        lastName: user.profile.public.lastName,
        aboutMe: user.profile.public.aboutMe ?? null,
        isPublic: user.profile.public.isPublic ?? true,
        dateOfBirth: user.profile.public.dateOfBirth
          ? toDateOnlyUtc(user.profile.public.dateOfBirth)
          : null,
        location: user.profile.public.location ?? null,
        isOpenToWork: user.profile.public.isOpenToWork ?? false,
        profileImageUrl: user.profile.public.profileImageUrl ?? null,
      },
    });

    await prisma.profilesPrivate.upsert({
      where: { userId: user.id },
      update: {
        phoneNumber: user.profile.private.phoneNumber ?? null,
      },
      create: {
        userId: user.id,
        phoneNumber: user.profile.private.phoneNumber ?? null,
      },
    });

    if (user.profile.careers.length > 0) {
      await prisma.profileCareer.deleteMany({
        where: {
          userId: user.id,
          id: { notIn: user.profile.careers.map((career) => career.id) },
        },
      });
    } else {
      await prisma.profileCareer.deleteMany({
        where: { userId: user.id },
      });
    }

    for (const career of user.profile.careers) {
      await prisma.profileCareer.upsert({
        where: { id: career.id },
        update: {
          userId: user.id,
          companyName: career.companyName,
          positionTitle: career.positionTitle,
          jobId: career.jobId,
          employmentType: career.employmentType,
          startDate: toDateOnlyUtc(career.startDate),
          endDate: career.endDate ? toDateOnlyUtc(career.endDate) : null,
          description: career.description ?? null,
          experienceLevel: career.experienceLevel ?? null,
          sortOrder: career.sortOrder ?? 0,
        },
        create: {
          id: career.id,
          userId: user.id,
          companyName: career.companyName,
          positionTitle: career.positionTitle,
          jobId: career.jobId,
          employmentType: career.employmentType,
          startDate: toDateOnlyUtc(career.startDate),
          endDate: career.endDate ? toDateOnlyUtc(career.endDate) : null,
          description: career.description ?? null,
          experienceLevel: career.experienceLevel ?? null,
          sortOrder: career.sortOrder ?? 0,
        },
      });
    }

    if (user.profile.educations.length > 0) {
      await prisma.profileEducation.deleteMany({
        where: {
          userId: user.id,
          id: {
            notIn: user.profile.educations.map((education) => education.id),
          },
        },
      });
    } else {
      await prisma.profileEducation.deleteMany({
        where: { userId: user.id },
      });
    }

    for (const education of user.profile.educations) {
      await prisma.profileEducation.upsert({
        where: { id: education.id },
        update: {
          userId: user.id,
          institutionName: education.institutionName,
          educationType: education.educationType,
          field: education.field ?? null,
          graduationStatus: education.graduationStatus ?? 'ENROLLED',
          startDate: toDateOnlyUtc(education.startDate),
          endDate: education.endDate ? toDateOnlyUtc(education.endDate) : null,
          sortOrder: education.sortOrder ?? 0,
        },
        create: {
          id: education.id,
          userId: user.id,
          institutionName: education.institutionName,
          educationType: education.educationType,
          field: education.field ?? null,
          graduationStatus: education.graduationStatus ?? 'ENROLLED',
          startDate: toDateOnlyUtc(education.startDate),
          endDate: education.endDate ? toDateOnlyUtc(education.endDate) : null,
          sortOrder: education.sortOrder ?? 0,
        },
      });
    }

    if (user.profile.languages.length > 0) {
      await prisma.profileLanguage.deleteMany({
        where: {
          userId: user.id,
          id: { notIn: user.profile.languages.map((language) => language.id) },
        },
      });
    } else {
      await prisma.profileLanguage.deleteMany({
        where: { userId: user.id },
      });
    }

    for (const language of user.profile.languages) {
      await prisma.profileLanguage.upsert({
        where: { id: language.id },
        update: {
          userId: user.id,
          language: language.language,
          proficiency: language.proficiency,
          testName: language.testName ?? null,
          testScore: language.testScore ?? null,
          sortOrder: language.sortOrder ?? 0,
        },
        create: {
          id: language.id,
          userId: user.id,
          language: language.language,
          proficiency: language.proficiency,
          testName: language.testName ?? null,
          testScore: language.testScore ?? null,
          sortOrder: language.sortOrder ?? 0,
        },
      });
    }

    if (user.profile.urls.length > 0) {
      await prisma.profileUrl.deleteMany({
        where: {
          userId: user.id,
          id: { notIn: user.profile.urls.map((url) => url.id) },
        },
      });
    } else {
      await prisma.profileUrl.deleteMany({
        where: { userId: user.id },
      });
    }

    for (const url of user.profile.urls) {
      await prisma.profileUrl.upsert({
        where: { id: url.id },
        update: {
          userId: user.id,
          label: url.label,
          url: url.url,
          sortOrder: url.sortOrder ?? 0,
        },
        create: {
          id: url.id,
          userId: user.id,
          label: url.label,
          url: url.url,
          sortOrder: url.sortOrder ?? 0,
        },
      });
    }

    const certifications = user.profile.certifications ?? [];
    if (certifications.length > 0) {
      await prisma.profileCertification.deleteMany({
        where: {
          userId: user.id,
          id: {
            notIn: certifications.map((certification) => certification.id),
          },
        },
      });
    } else {
      await prisma.profileCertification.deleteMany({
        where: { userId: user.id },
      });
    }

    for (const certification of certifications) {
      await prisma.profileCertification.upsert({
        where: { id: certification.id },
        update: {
          userId: user.id,
          name: certification.name,
          date: toDateOnlyUtc(certification.date),
          description: certification.description ?? null,
          institutionName: certification.institutionName ?? null,
          sortOrder: certification.sortOrder ?? 0,
        },
        create: {
          id: certification.id,
          userId: user.id,
          name: certification.name,
          date: toDateOnlyUtc(certification.date),
          description: certification.description ?? null,
          institutionName: certification.institutionName ?? null,
          sortOrder: certification.sortOrder ?? 0,
        },
      });
    }

    const attachments = user.profile.attachments ?? [];
    if (attachments.length > 0) {
      await prisma.profileAttachment.deleteMany({
        where: {
          userId: user.id,
          id: { notIn: attachments.map((attachment) => attachment.id) },
        },
      });
    } else {
      await prisma.profileAttachment.deleteMany({
        where: { userId: user.id },
      });
    }

    for (const attachment of attachments) {
      await prisma.profileAttachment.upsert({
        where: { id: attachment.id },
        update: {
          userId: user.id,
          label: attachment.label ?? null,
          fileType: attachment.fileType,
          mimeType: attachment.mimeType,
          sizeBytes: BigInt(attachment.sizeBytes),
          originalFileName: attachment.originalFileName,
          s3Bucket: attachment.s3Bucket,
          s3Key: attachment.s3Key,
        },
        create: {
          id: attachment.id,
          userId: user.id,
          label: attachment.label ?? null,
          fileType: attachment.fileType,
          mimeType: attachment.mimeType,
          sizeBytes: BigInt(attachment.sizeBytes),
          originalFileName: attachment.originalFileName,
          s3Bucket: attachment.s3Bucket,
          s3Key: attachment.s3Key,
        },
      });
    }

    if (user.profile.skillIds.length > 0) {
      await prisma.profileSkill.deleteMany({
        where: { userId: user.id, skillId: { notIn: user.profile.skillIds } },
      });
      await prisma.profileSkill.createMany({
        data: user.profile.skillIds.map((skillId) => ({
          userId: user.id,
          skillId,
        })),
        skipDuplicates: true,
      });
    } else {
      await prisma.profileSkill.deleteMany({
        where: { userId: user.id },
      });
    }
  }

  console.log(`시드 완료: sample users ${users.length}`);
}

async function seedSampleCredentialAccounts(users: SampleUserSeed[]) {
  for (const user of users) {
    if (!user.seedPassword) continue;

    const passwordHash = await hashPassword(user.seedPassword);
    const existingCredentialAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: 'credential',
      },
      select: { id: true },
    });

    if (existingCredentialAccount) {
      await prisma.account.update({
        where: { id: existingCredentialAccount.id },
        data: {
          accountId: user.id,
          providerId: 'credential',
          password: passwordHash,
        },
      });
      continue;
    }

    await prisma.account.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        accountId: user.id,
        providerId: 'credential',
        password: passwordHash,
      },
    });
  }

  console.log('시드 완료: credential 계정 생성/갱신');
  console.log('테스트 로그인 계정');
  console.log('  candidate: candidate@likelion.net / @Aaa111!');
  console.log('  recruiter: recruiter@likelion.net / @Aaa111!');
  console.log('  admin: likelion@likelion.net / @Aaa111!');
}

async function seedSampleApplies(applies: SampleApplySeed[]) {
  for (const apply of applies) {
    await prisma.apply.upsert({
      where: {
        userId_jdId: {
          userId: apply.userId,
          jdId: apply.jdId,
        },
      },
      update: {
        status: apply.status ?? 'applied',
      },
      create: {
        userId: apply.userId,
        jdId: apply.jdId,
        status: apply.status ?? 'applied',
      },
    });
  }

  console.log(`시드 완료: sample applies ${applies.length}`);
}

async function seedAnnouncements(announcements: SampleAnnouncementSeed[]) {
  for (const chunk of chunkArray(announcements, 100)) {
    for (const announcement of chunk) {
      await prisma.announcement.upsert({
        where: { id: announcement.id },
        update: {
          title: announcement.title,
          content: announcement.content,
          isPinned: announcement.isPinned ?? false,
        },
        create: {
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          isPinned: announcement.isPinned ?? false,
        },
      });
    }
  }

  console.log(`시드 완료: announcements ${announcements.length}`);
}

async function main() {
  const families = loadJson<JobFamilySeed[]>('job-families.json');
  const skills = loadJson<SkillSeed[]>('skills.json');
  const seedScope = resolveSeedScope(process.env.SEED_SCOPE);

  if (seedScope === 'prod_v0_1_core3') {
    const coreUsers = buildCanonicalUsers({
      orgId: SAMPLE_IDS.org,
      password: CANONICAL_PASSWORD,
    });

    await seedJobFamilies(families);
    await seedSkills(skills);
    await seedSampleOrg();
    await seedSampleUsers(coreUsers);
    await seedSampleCredentialAccounts(coreUsers);

    console.log(
      `seed scope(${seedScope}) 완료: families ${families.length}, jobs ${families.reduce((sum, f) => sum + f.jobs.length, 0)}, skills ${skills.length}, users ${coreUsers.length}`
    );
    return;
  }

  const { users, jobDescriptions, announcements, applies, coverageReport } =
    buildSeedDataset({
      families,
      skills,
    });

  await seedJobFamilies(families);
  await seedSkills(skills);
  await seedSampleOrg();
  await seedSampleJobDescriptions(jobDescriptions);
  await seedAnnouncements(announcements);
  await seedSampleUsers(users);
  await seedSampleCredentialAccounts(users);
  await seedSampleApplies(applies);

  console.log(
    `coverage 검증 통과: missing ${coverageReport.missing.length}, users ${users.length}, jds ${jobDescriptions.length}, announcements ${announcements.length}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
