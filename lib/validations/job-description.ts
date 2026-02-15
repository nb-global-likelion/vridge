import { z } from 'zod';

export const jobDescriptionFilterSchema = z.object({
  jobId: z.string().optional(),
  employmentType: z
    .enum(['full_time', 'part_time', 'intern', 'freelance'])
    .optional(),
  workArrangement: z.enum(['onsite', 'hybrid', 'remote']).optional(),
  search: z.string().optional(),
  familyId: z.string().optional(),
  sort: z.enum(['updated_desc', 'created_desc']).default('updated_desc'),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(20),
});
