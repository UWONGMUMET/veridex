import { Hono } from "hono";

import {
    searchProjectIdSchema,
    searchQuerySchema,
} from "./search.schema";
import { searchProject } from "./search.service";

export const searchRoutes = new Hono();

searchRoutes.get(
    "/research-projects/:projectId/search",
    async (context) => {
        const projectIdResult = searchProjectIdSchema.safeParse(
            context.req.param("projectId"),
        );

        if (!projectIdResult.success) {
            return context.json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Research project ID is invalid",
                },
            }, 400);
        }

        const queryResult = searchQuerySchema.safeParse({
            q: context.req.query("q"),
            limit: context.req.query("limit") ?? 5,
        });

        if (!queryResult.success) {
            return context.json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Search query is invalid",
                    details: queryResult.error.issues.map(
                        (issue) => ({
                            field: issue.path.join("."),
                            message: issue.message,
                        }),
                    ),
                },
            }, 400);
        }

        const result = await searchProject(
            projectIdResult.data,
            queryResult.data,
        );

        return context.json({
            data: result.results,
        });
    },
);
