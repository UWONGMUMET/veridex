import { Hono } from "hono";

import { documentIdSchema } from "../documents/document.schema";
import { indexDocument } from "./indexing.service";

export const indexingRoutes = new Hono();

indexingRoutes.post(
    "/documents/:documentId/index",
    async (context) => {
        const idResult = documentIdSchema.safeParse(
            context.req.param("documentId"),
        );

        if (!idResult.success) {
            return context.json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Document ID is invalid",
                },
            }, 400);
        }

        const result = await indexDocument(idResult.data);

        return context.json({
            data: result,
        });
    },
);
