import { desc, eq } from "drizzle-orm";
import { database } from "../../database/client";
import { researchProjects } from "../../database/schema";
import type { CreateResearchProjectInput, UpdateResearchProjectInput } from "./research-project.schema";

export const createResearchProjectRepository = async (input: CreateResearchProjectInput) => {
    const [project] = await database.insert(researchProjects).values(input).returning();
    if(!project) {
        throw new Error("Failed to create research project");
    }
    return project;
};

export const listResearchProjectsRepository = async () => {
    return database.select().from(researchProjects).orderBy(desc(researchProjects.createdAt));
};

export const findResearchProjectByIdRepository = async (id: string) => {
    const [project] = await database.select().from(researchProjects).where(eq(researchProjects.id, id)).limit(1);
    return project;
};

export const updateResearchProjectRepository = async(id: string, input: UpdateResearchProjectInput) => {
    const [project] = await database.update(researchProjects).set({
        ...input,
        updatedAt: new Date(),
    }).where(eq(researchProjects.id, id)).returning();
    return project
};

export const deleteResearchProjectRepository= async(id: string) => {
    const deleted = await database.delete(researchProjects).where(eq(researchProjects.id, id)).returning({
        id: researchProjects.id
    });
    return deleted.length > 0;
};