import { z } from 'zod';

export const profilePublicSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  aboutMe: z.string().max(2000).optional(),
});

export const profilePrivateSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/)
    .optional(),
});

export const profileLanguageSchema = z.object({
  language: z.string().min(1),
  proficiency: z.enum(['native', 'fluent', 'professional', 'basic']),
  sortOrder: z.number().int().min(0),
});

export const profileCareerSchema = z
  .object({
    companyName: z.string().min(1),
    positionTitle: z.string().min(1),
    jobId: z.string().min(1),
    employmentType: z.enum(['full_time', 'part_time', 'intern', 'freelance']),
    startDate: z.string().date(),
    endDate: z.string().date().optional(),
    description: z.string().max(5000).optional(),
    sortOrder: z.number().int().min(0),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: '종료일은 시작일 이후여야 합니다',
    path: ['endDate'],
  });

export const profileEducationSchema = z
  .object({
    institutionName: z.string().min(1),
    educationType: z.enum([
      'vet_elementary',
      'vet_intermediate',
      'vet_college',
      'higher_bachelor',
      'higher_master',
      'higher_doctorate',
      'continuing_education',
      'international_program',
      'other',
    ]),
    field: z.string().optional(),
    isGraduated: z.boolean(),
    startDate: z.string().date(),
    endDate: z.string().date().optional(),
    sortOrder: z.number().int().min(0),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: '종료일은 시작일 이후여야 합니다',
    path: ['endDate'],
  });

export const profileUrlSchema = z.object({
  label: z.string().min(1),
  url: z
    .string()
    .url()
    .refine((val) => val.startsWith('http://') || val.startsWith('https://'), {
      message: 'http 또는 https URL이어야 합니다',
    }),
  sortOrder: z.number().int().min(0),
});

export const profileSkillSchema = z.object({
  skillId: z.string().min(1),
});
