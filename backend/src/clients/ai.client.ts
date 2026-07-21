import { z } from "zod";
import { env } from "../config/env";

const parseDocumentResponseSchema = z.object({
    document_id: z.string().uuid(),
    parsed_storage_key: z.string().min(1),
    page_count: z.number().int().nonnegative(),
    character_count: z.number().int().nonnegative(),
});

type ParseDocumentInput = {
    documentId: string,
    storageKey: string;
    mimeType: string;
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
}