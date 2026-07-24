import { searchWithAi } from "../../clients/ai.client";
import { AppError } from "../../utils/app-error";
import { getResearchProject } from "../research-projects/research-project.service";
import type { SearchQuery } from "./search.schema";

export const searchProject = async (
    projectId: string,
    input: SearchQuery
) => {
    await getResearchProject(projectId);
    try {
        return await searchWithAi({
            projectId,
            query: input.q,
            limit: input.limit,
        })
    } catch {
        throw new AppError("Semantic search failed", 502, "SEMANTIC_SEARCH_FAILED");
    }
};