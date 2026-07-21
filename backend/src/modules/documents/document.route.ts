import { Hono } from "hono";

import {
    documentIdSchema,
    documentProjectIdSchema,
} from "./document.schema";
import {
    deleteDocument,
    getDocument,
    getDocumentContent,
    listProjectDocuments,
    uploadDocument,
} from "./document.service";

export const documentRoutes = new Hono();

documentRoutes.post(
    "/research-projects/:projectId/documents",
    async (context) => {
        const projectIdResult = documentProjectIdSchema.safeParse(
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

        const body = await context.req.parseBody();
        const file = body.file;

        if (!(file instanceof File)) {
            return context.json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "A file must be provided in the file field",
                },
            }, 400);
        }

        const document = await uploadDocument(
            projectIdResult.data,
            file,
        );

        return context.json({
            data: document,
        }, 201);
    },
);

documentRoutes.get(
    "/research-projects/:projectId/documents",
    async (context) => {
        const projectIdResult = documentProjectIdSchema.safeParse(
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

        const documents = await listProjectDocuments(
            projectIdResult.data,
        );

        return context.json({
            data: documents,
        });
    },
);

documentRoutes.get(
    "/documents/:documentId/content",
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

        const content = await getDocumentContent(idResult.data);

        return context.json({
            data: content,
        });
    },
);

documentRoutes.get(
    "/documents/:documentId",
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

        const document = await getDocument(idResult.data);

        return context.json({
            data: document,
        });
    },
);

documentRoutes.delete(
    "/documents/:documentId",
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

        await deleteDocument(idResult.data);

        return context.body(null, 204);
    },
);
