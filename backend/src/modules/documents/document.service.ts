import { parseDocumentWithAi } from "../../clients/ai.client";
import { env } from "../../config/env";
import { 
    deleteStoredFile,
    readStoredText,
    writeStoredFile,
} from "../../storage/local-storage";
import { AppError, NotFoundError } from "../../utils/app-error";

import { getResearchProject } from "../research-projects/research-project.service";
import { 
    createDocumentRepository,
    deleteDocumentRepository,
    findDocumentByIdProjectRepository,
    listDocumentsByProjectRepository,
    updateDocumentRepository 
} from "./document.repository";
import { isAllowedMimeType } from "./document.schema";

const extensionByMimeType: Record<string, string> = {
    "application/pdf": "pdf",
    "text/plain": "txt",
    "text/markdown": "md",
}

const getSafeFileName = (fileName: string): string => {
    return fileName.split(/[\\/]/).pop() ?? "document";
};

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message.slice(0, 1000);
    }

    return "Unknown document processing error";
};

export const uploadDocument = async (researchProjectId: string, file: File) => {
    await getResearchProject(researchProjectId);
    if(!isAllowedMimeType(file.type)) {
        throw new AppError("Only PDF, TXT, and Markdown files are supported", 422, "UNSUPPORTED_FILE_TYPE")
    };
    if(file.size === 0) {
        throw new AppError("Uploaded file is empty", 422, "EMPTY_FILE")
    };
    if(file.size > env.maxFileSizeBytes) {
        throw new AppError("File is larger than the allowed limit", 422, "FILE_TOO_LARGE");
    };

    const documentId = crypto.randomUUID();
    const extension = extensionByMimeType[file.type];
    const storageKey = `originals/projects/${researchProjectId}/` + `${documentId}.${extension}`;
    const document = await createDocumentRepository({
        id: documentId,
        researchProjectId,
        name: getSafeFileName(file.name),
        sourceType: "upload",
        storageKey,
        mimeType: file.type,
        fileSize: file.size,
        status: "pending",
    });
    try {
        const fileData = new Uint8Array(
            await file.arrayBuffer(),
        );

        await writeStoredFile({
            key: storageKey,
            data: fileData
        });

        await updateDocumentRepository(document.id, {
            status: "processing",
            errorMessage: null,
        });

        const parseResult = await parseDocumentWithAi({
            documentId: document.id,
            storageKey,
            mimeType: file.type,
        });

        const readyDocument = await updateDocumentRepository(
            document.id,
            {
                status: "ready",
                parsedStorageKey: parseResult.parsed_storage_key,
                pageCount: parseResult.page_count,
                characterCount: parseResult.character_count,
                errorMessage: null,
            }
        );
        if(!readyDocument) {
            throw new Error("Document disappeared during processing")
        }
        return readyDocument;
    } catch (error) {
        await updateDocumentRepository(document.id, {
            status: "failed",
            errorMessage: getErrorMessage(error),
        });
        throw new AppError("Document processing failed", 502, "DOCUMENT_PROCESSING_FAILED");
    }
};

export const listProjectDocuments = async (researchProjectId: string) => {
    await getResearchProject(researchProjectId);
    return listDocumentsByProjectRepository(researchProjectId);
};

export const getDocument = async (id: string) => {
    const document = await findDocumentByIdProjectRepository(id);
    if(!document) {
        throw new NotFoundError("Document not found");
    }
    return document;
};

export const getDocumentContent = async (id: string) => {
    const document = await getDocument(id);
    if(document.status !== "ready" || !document.parsedStorageKey) {
        throw new AppError("Document content is not ready", 409, "DOCUMENT_NOT_READY");
    }

    const content = await readStoredText(document.parsedStorageKey);
    return {
        documentId: document.id,
        content
    }
};

export const deleteDocument = async (id: string) => {
    const document = await getDocument(id);
    if(document.storageKey) {
        await deleteStoredFile(document.storageKey);
    }
    if(document.parsedStorageKey) {
        await deleteStoredFile(document.parsedStorageKey);
    }
    
    const deleted = await deleteDocumentRepository(document.id);
    if(!deleted) {
        throw new NotFoundError("Document not found");
    }
}