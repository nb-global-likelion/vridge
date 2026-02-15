import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

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

interface SampleJobDescriptionSeed {
  id: string;
  orgId?: string;
  jobId: string;
  title: string;
  employmentType: 'full_time' | 'part_time' | 'intern' | 'freelance';
  workArrangement: 'onsite' | 'hybrid' | 'remote';
  minYearsExperience?: number;
  minEducation?:
    | 'vet_elementary'
    | 'vet_intermediate'
    | 'vet_college'
    | 'higher_bachelor'
    | 'higher_master'
    | 'higher_doctorate'
    | 'continuing_education'
    | 'international_program'
    | 'other';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: 'year' | 'month' | 'hour';
  salaryIsNegotiable?: boolean;
  descriptionMarkdown?: string;
  skillIds: string[];
}

interface SampleProfileSeed {
  public: {
    firstName: string;
    lastName: string;
    aboutMe?: string;
    isPublic?: boolean;
  };
  private: {
    phoneNumber?: string;
  };
  careers: Array<{
    id: string;
    companyName: string;
    positionTitle: string;
    jobId: string;
    employmentType: 'full_time' | 'part_time' | 'intern' | 'freelance';
    startDate: string;
    endDate?: string;
    description?: string;
    sortOrder?: number;
  }>;
  educations: Array<{
    id: string;
    institutionName: string;
    educationType:
      | 'vet_elementary'
      | 'vet_intermediate'
      | 'vet_college'
      | 'higher_bachelor'
      | 'higher_master'
      | 'higher_doctorate'
      | 'continuing_education'
      | 'international_program'
      | 'other';
    field?: string;
    graduationStatus?:
      | 'ENROLLED'
      | 'ON_LEAVE'
      | 'GRADUATED'
      | 'EXPECTED'
      | 'WITHDRAWN';
    startDate: string;
    endDate?: string;
    sortOrder?: number;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: 'native' | 'fluent' | 'professional' | 'basic';
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
  skillIds: string[];
}

interface SampleUserSeed {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  orgId?: string;
  seedPassword?: string;
  profile?: SampleProfileSeed;
}

interface SampleApplySeed {
  userId: string;
  jdId: string;
  status?: 'applied' | 'accepted' | 'rejected' | 'withdrawn';
}

interface SampleAnnouncementSeed {
  id: string;
  title: string;
  content: string;
  isPinned?: boolean;
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
} as const;

const SAMPLE_JOB_DESCRIPTIONS: SampleJobDescriptionSeed[] = [
  {
    id: SAMPLE_IDS.jdFrontend,
    orgId: SAMPLE_IDS.org,
    jobId: 'frontend-engineer',
    title: 'Frontend Engineer (Next.js)',
    employmentType: 'full_time',
    workArrangement: 'remote',
    minYearsExperience: 2,
    minEducation: 'higher_bachelor',
    salaryMin: 30000000,
    salaryMax: 45000000,
    salaryCurrency: 'VND',
    salaryPeriod: 'month',
    salaryIsNegotiable: false,
    descriptionMarkdown:
      'Build and ship candidate-facing product features with React and Next.js.',
    skillIds: ['typescript', 'react', 'nextjs', 'css'],
  },
  {
    id: SAMPLE_IDS.jdBackend,
    orgId: SAMPLE_IDS.org,
    jobId: 'backend-engineer',
    title: 'Backend Engineer (Node.js)',
    employmentType: 'full_time',
    workArrangement: 'hybrid',
    minYearsExperience: 3,
    minEducation: 'higher_bachelor',
    salaryMin: 35000000,
    salaryMax: 55000000,
    salaryCurrency: 'VND',
    salaryPeriod: 'month',
    salaryIsNegotiable: true,
    descriptionMarkdown:
      'Design APIs, data models, and integration pipelines for ATS core services.',
    skillIds: ['nodejs', 'postgresql', 'sql', 'docker', 'aws'],
  },
  {
    id: SAMPLE_IDS.jdProduct,
    orgId: SAMPLE_IDS.org,
    jobId: 'product-manager',
    title: 'Product Manager (ATS)',
    employmentType: 'full_time',
    workArrangement: 'onsite',
    minYearsExperience: 4,
    minEducation: 'higher_bachelor',
    salaryMin: 40000000,
    salaryMax: 65000000,
    salaryCurrency: 'VND',
    salaryPeriod: 'month',
    salaryIsNegotiable: true,
    descriptionMarkdown:
      'Own product planning, prioritize roadmap, and collaborate across design and engineering.',
    skillIds: ['agile', 'scrum', 'project-management', 'communication'],
  },
];

const SAMPLE_USERS: SampleUserSeed[] = [
  {
    id: SAMPLE_IDS.recruiter,
    name: 'Recruiter Demo',
    email: 'recruiter.demo@example.com',
    role: 'recruiter',
    orgId: SAMPLE_IDS.org,
    seedPassword: 'Password123!',
  },
  {
    id: SAMPLE_IDS.admin,
    name: 'Admin Demo',
    email: 'admin.demo@example.com',
    role: 'admin',
    orgId: SAMPLE_IDS.org,
    seedPassword: 'Password123!',
  },
  {
    id: SAMPLE_IDS.candidateA,
    name: 'Minji Kim',
    email: 'minji.kim@example.com',
    role: 'candidate',
    seedPassword: 'Password123!',
    profile: {
      public: {
        firstName: 'Minji',
        lastName: 'Kim',
        aboutMe:
          'Frontend engineer focused on React and product UX in B2B web apps.',
        isPublic: true,
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
    id: SAMPLE_IDS.candidateB,
    name: 'Anh Nguyen',
    email: 'anh.nguyen@example.com',
    role: 'candidate',
    seedPassword: 'Password123!',
    profile: {
      public: {
        firstName: 'Anh',
        lastName: 'Nguyen',
        aboutMe:
          'Backend engineer with production experience in APIs, Postgres, and cloud deployment.',
        isPublic: true,
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
          description: 'Implemented API services and query optimizations.',
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
      skillIds: ['nodejs', 'postgresql', 'docker', 'aws', 'problem-solving'],
    },
  },
];

const SAMPLE_APPLIES: SampleApplySeed[] = [
  {
    userId: SAMPLE_IDS.candidateA,
    jdId: SAMPLE_IDS.jdFrontend,
    status: 'applied',
  },
  {
    userId: SAMPLE_IDS.candidateA,
    jdId: SAMPLE_IDS.jdProduct,
    status: 'applied',
  },
  {
    userId: SAMPLE_IDS.candidateB,
    jdId: SAMPLE_IDS.jdBackend,
    status: 'applied',
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

function dateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function loadJson<T>(filename: string): T {
  const path = join(__dirname, 'seed-data', filename);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

async function seedJobFamilies() {
  const families = loadJson<JobFamilySeed[]>('job-families.json');

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

async function seedSkills() {
  const skills = loadJson<SkillSeed[]>('skills.json');

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

async function seedSampleJobDescriptions() {
  for (const jd of SAMPLE_JOB_DESCRIPTIONS) {
    await prisma.jobDescription.upsert({
      where: { id: jd.id },
      update: {
        orgId: jd.orgId ?? null,
        jobId: jd.jobId,
        title: jd.title,
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

    await prisma.jobDescriptionSkill.deleteMany({
      where: { jdId: jd.id, skillId: { notIn: jd.skillIds } },
    });

    await prisma.jobDescriptionSkill.createMany({
      data: jd.skillIds.map((skillId) => ({ jdId: jd.id, skillId })),
      skipDuplicates: true,
    });
  }

  console.log(`시드 완료: sample jds ${SAMPLE_JOB_DESCRIPTIONS.length}`);
}

async function seedSampleUsers() {
  for (const user of SAMPLE_USERS) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        emailVerified: true,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: true,
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
      },
      create: {
        userId: user.id,
        firstName: user.profile.public.firstName,
        lastName: user.profile.public.lastName,
        aboutMe: user.profile.public.aboutMe ?? null,
        isPublic: user.profile.public.isPublic ?? true,
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

    for (const career of user.profile.careers) {
      await prisma.profileCareer.upsert({
        where: { id: career.id },
        update: {
          userId: user.id,
          companyName: career.companyName,
          positionTitle: career.positionTitle,
          jobId: career.jobId,
          employmentType: career.employmentType,
          startDate: dateOnly(career.startDate),
          endDate: career.endDate ? dateOnly(career.endDate) : null,
          description: career.description ?? null,
          sortOrder: career.sortOrder ?? 0,
        },
        create: {
          id: career.id,
          userId: user.id,
          companyName: career.companyName,
          positionTitle: career.positionTitle,
          jobId: career.jobId,
          employmentType: career.employmentType,
          startDate: dateOnly(career.startDate),
          endDate: career.endDate ? dateOnly(career.endDate) : null,
          description: career.description ?? null,
          sortOrder: career.sortOrder ?? 0,
        },
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
          startDate: dateOnly(education.startDate),
          endDate: education.endDate ? dateOnly(education.endDate) : null,
          sortOrder: education.sortOrder ?? 0,
        },
        create: {
          id: education.id,
          userId: user.id,
          institutionName: education.institutionName,
          educationType: education.educationType,
          field: education.field ?? null,
          graduationStatus: education.graduationStatus ?? 'ENROLLED',
          startDate: dateOnly(education.startDate),
          endDate: education.endDate ? dateOnly(education.endDate) : null,
          sortOrder: education.sortOrder ?? 0,
        },
      });
    }

    for (const language of user.profile.languages) {
      await prisma.profileLanguage.upsert({
        where: { id: language.id },
        update: {
          userId: user.id,
          language: language.language,
          proficiency: language.proficiency,
          sortOrder: language.sortOrder ?? 0,
        },
        create: {
          id: language.id,
          userId: user.id,
          language: language.language,
          proficiency: language.proficiency,
          sortOrder: language.sortOrder ?? 0,
        },
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

    for (const certification of user.profile.certifications ?? []) {
      await prisma.profileCertification.upsert({
        where: { id: certification.id },
        update: {
          userId: user.id,
          name: certification.name,
          date: dateOnly(certification.date),
          description: certification.description ?? null,
          institutionName: certification.institutionName ?? null,
          sortOrder: certification.sortOrder ?? 0,
        },
        create: {
          id: certification.id,
          userId: user.id,
          name: certification.name,
          date: dateOnly(certification.date),
          description: certification.description ?? null,
          institutionName: certification.institutionName ?? null,
          sortOrder: certification.sortOrder ?? 0,
        },
      });
    }

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
  }

  console.log(`시드 완료: sample users ${SAMPLE_USERS.length}`);
}

async function seedSampleCredentialAccounts() {
  for (const user of SAMPLE_USERS) {
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
  console.log('  candidate: minji.kim@example.com / Password123!');
  console.log('  recruiter: recruiter.demo@example.com / Password123!');
  console.log('  admin: admin.demo@example.com / Password123!');
}

async function seedSampleApplies() {
  await prisma.apply.createMany({
    data: SAMPLE_APPLIES.map((apply) => ({
      userId: apply.userId,
      jdId: apply.jdId,
      status: apply.status ?? 'applied',
    })),
    skipDuplicates: true,
  });

  console.log(`시드 완료: sample applies ${SAMPLE_APPLIES.length}`);
}

async function seedAnnouncements() {
  for (const announcement of SAMPLE_ANNOUNCEMENTS) {
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

  console.log(`시드 완료: announcements ${SAMPLE_ANNOUNCEMENTS.length}`);
}

async function main() {
  await seedJobFamilies();
  await seedSkills();
  await seedSampleOrg();
  await seedSampleJobDescriptions();
  await seedAnnouncements();
  await seedSampleUsers();
  await seedSampleCredentialAccounts();
  await seedSampleApplies();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
