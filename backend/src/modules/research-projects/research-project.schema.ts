import { z } from "zod";

export const createResearchProjectSchema = z.object({
    title: z.string().trim().min(1).max(200),
    question: z.string().trim().min(10).max(5000),
    description: z.string().trim().max(5000).optional(),
});

export const updateResearchProjectSchema = z.object({
    title: z.string().trim().min(1).max(200).optional(),
    question: z.string().trim().min(10).max(5000),
    description: z.string().trim().max(5000).nullable().optional(),
    status: z.enum(["draft", "ready", "running", "completed", "failed"]).optional(),
}).refine((input) => {
    return Object.keys(input).length > 0;
}, {
    message: "Atleast one field must be provided"
});

export const researchProjectIdSchema = z.string().uuid();
export type CreateResearchProjectInput = z.infer<typeof createResearchProjectSchema>
export type UpdateResearchProjectInput = z.infer<typeof updateResearchProjectSchema>