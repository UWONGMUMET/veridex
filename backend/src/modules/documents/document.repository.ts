import { desc, eq } from "drizzle-orm";
import { database } from "../../database/client";
import { documents, type NewDocument } from "../../database/schema";

type DocumentUpdate = Partial<NewDocument>;

export const createDocumentRepository = async (input: NewDocument) => {
    const [document] = await database.insert(documents).values(input).returning();
    if(!document) {
        throw new Error("Failed to create document")
    }
    return document;
};

export const listDocumentsByProjectRepository = async (researchProjectId: string) => {
    return database.select().from(documents).where(eq(documents.researchProjectId, researchProjectId)).orderBy(desc(documents.createdAt));
};

export const findDocumentByIdProjectRepository = async (id: string) => {
    const [document] = await database.select().from(documents).where(eq(documents.id, id)).limit(1);
    return document;
};

export const updateDocumentRepository = async (id: string, input: DocumentUpdate) => {
    const [document] = await database.update(documents).set({
        ...input,
        updatedAt: new Date(),
    }).where(eq(documents.id, id)).returning();
    return document;
};

export const deleteDocumentRepository = async (id: string) => {
    const deleted = await database.delete(documents).where(eq(documents.id, id)).returning({
        id: documents.id,
    });
    return deleted.length > 0
};