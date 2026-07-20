import { Hono } from "hono";
import { 
    createResearchProjectSchema,
    researchProjectIdSchema,
    updateResearchProjectSchema 
} from "./research-project.schema";

import { 
    createResearchProject,
    deleteResearchProject,
    getResearchProject,
    listResearchProjects,
    updateResearchProject
} from "./research-project.service";

export const researchProjectRoutes = new Hono();

researchProjectRoutes.post(
    "/",
    async (context) => {
        const body = await context.req.json().catch(() => null);
        const result = createResearchProjectSchema.safeParse(body);
        if(!result.success) {
            return context.json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Request data is invalid",
                    details: result.error.issues.map(
                        (issue) => ({
                            field: issue.path.join("."),
                            message: issue.message,
                        }),
                    ),
                },
            }, 400);
        };
        const project = await createResearchProject(result.data);
        return context.json(
            {
                data: project,
            },
            201,
        );
    }
    
)