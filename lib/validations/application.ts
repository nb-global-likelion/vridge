import { z } from 'zod';

export const applySchema = z.object({
  jdId: z.string().uuid(),
});
