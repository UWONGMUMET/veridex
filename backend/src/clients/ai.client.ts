import { z } from "zod";
import { env } from "../config/env";

const parseDocumentResponseSchema = z.object({
    document_id: z.string().uuid(),
    parsed_storage_key: z.string().min(1),
    page_count: z.number().int().nonnegative(),
    character_count: z.number().int().nonnegative(),
});

const indexDocumentResponseSchema = z.object({
    document_id: z.string().uuid(),
    chunk_count: z.number().int().nonnegative(),
    indexed: z.boolean(),
});

const searchResponseSchema = z.object({
    results: z.array(
        z.object({
            document_id: z.string().uuid(),
            document_name: z.string(),
            position: z.number().int(),
            content: z.string(),
            similarity: z.number(),
        })
    )
})

type ParseDocumentInput = {
    documentId: string,
    storageKey: string;
    mimeType: string;
};

type IndexDocumentInput = {
    documentId: string;
    parsedStorageKey: string;
}

type SearchInput = {
    projectId: string;
    query: string;
    limit: number;
};

const requestAi = async (
    path: string,
    body: Record<string, unknown>,
    timeout: number
) => {
    const response = await fetch(
        `${env.aiServiceUrl}${path}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(timeout),
        },
    );
    if (!response.ok) {
        const responseBody = await response.text().catch(() => "");
        throw new Error(
            `AI service returned ${response.status}: ${responseBody}`,
        );
    }
    return response.json();
};

export const parseDocumentWithAi = async (input: ParseDocumentInput) => {
    const response = await fetch(
        `${env.aiServiceUrl}/internal/documents/parse`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                document_id: input.documentId,
                storage_key: input.storageKey,
                mime_type: input.mimeType
            }),
            signal: AbortSignal.timeout(120_000)
        }
    );
    if(!response.ok) {
        const responseBody = await response.text().catch(() => "");
        throw new Error(`AI service returned ${response.status}: ${responseBody}`)
    };
    const body = await response.json();
    const result = parseDocumentResponseSchema.safeParse(body);
    if (!result.success) {
        throw new Error("AI service returned an invalid response")
    }
    return result.data;
};

export const indexDocumentWithAi = async (
    input: IndexDocumentInput,
) => {
    const body = await requestAi("/internal/indexing/documents",
        {
            document_id: input.documentId,
            parsed_storage_key: input.parsedStorageKey,
        },
        300_000,
    );
    return indexDocumentResponseSchema.parse(body);
};

export const searchWithAi = async (
    input: SearchInput,
) => {
    const body = await requestAi("/internal/search",
        {
            project_id: input.projectId,
            query: input.query,
            limit: input.limit,
        },
        60_000,
    );
    return searchResponseSchema.parse(body);
}