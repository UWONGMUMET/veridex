import { NotFoundError } from "../../utils/app-error";
import {
  createResearchProjectRepository,
  deleteResearchProjectRepository,
  findResearchProjectByIdRepository,
  listResearchProjectsRepository,
  updateResearchProjectRepository,
} from "./research-project.repository";

import type {
  CreateResearchProjectInput,
  UpdateResearchProjectInput,
} from "./research-project.schema";

export const createResearchProject = async (
  input: CreateResearchProjectInput,
) => {
  return createResearchProjectRepository(
    input,
  );
};

export const listResearchProjects = async () => {
  return listResearchProjectsRepository();
};

export const getResearchProject = async (
  id: string,
) => {
  const project =
    await findResearchProjectByIdRepository(
      id,
    );

  if (!project) {
    throw new NotFoundError(
      "Research project not found",
    );
  }

  return project;
};

export const updateResearchProject = async (
  id: string,
  input: UpdateResearchProjectInput,
) => {
  const project =
    await updateResearchProjectRepository(
      id,
      input,
    );

  if (!project) {
    throw new NotFoundError(
      "Research project not found",
    );
  }

  return project;
};

export const deleteResearchProject = async (
  id: string,
) => {
  const deleted =
    await deleteResearchProjectRepository(
      id,
    );

  if (!deleted) {
    throw new NotFoundError(
      "Research project not found",
    );
  }
};