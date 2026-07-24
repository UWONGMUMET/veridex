import { indexDocumentWithAi } from "../../clients/ai.client";
import { AppError } from "../../utils/app-error";
import { getDocument } from "../documents/document.service";

export const indexDocument = async (documentId: string) => {
    const document = await getDocument(documentId);
    if(document.status !== "ready" || !document.parsedStorageKey) {
        throw new AppError("Document must be parsed before indexing", 409, "DOCUMENT_NOT_READY")
    }
    try {
        return await indexDocumentWithAi(
            {
                documentId: document.id,
                parsedStorageKey: document.parsedStorageKey
            },
        );
    } catch {
        throw new AppError("Document indexing failed", 502, "DOCUMENT_INDEXING_FAILED")
    }
}