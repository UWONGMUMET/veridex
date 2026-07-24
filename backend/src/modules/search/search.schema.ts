import { z } from "zod";

export const searchProjectIdSchema = z.string().uuid();

export const searchQuerySchema = z.object({
    q: z.string().trim().min(2).max(1000),
    limit: z.coerce.number().int().min(1).max(20).default(5),
  });

export type SearchQuery =z.infer<typeof searchQuerySchema>;