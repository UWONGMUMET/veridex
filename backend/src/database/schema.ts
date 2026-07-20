import { 
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
    vector
} from "drizzle-orm/pg-core";

export const researchProjectStatusEnum = pgEnum(
    "research_project_status",
    [
        "draft",
        "ready",
        "running",
        "completed",
        "failed"
    ]
);

export const documentSourceTypeEnum = pgEnum(
    "document_source_type",
    [
        "upload",
        "url",
        "text"
    ]
);

export const documentStatusEnum = pgEnum(
    "document_status",
    [
        "pending",
        "processing",
        "ready",
        "failed"
    ]
);

export const researchRunStatusEnum = pgEnum(
    "research_run_status",
    [
        "queued",
        "running",
        "completed",
        "failed"
    ]
);

export const researchProjects = pgTable(
    "research_projects",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        title: varchar("title", { length: 200 }).notNull(),
        question: text("question").notNull(),
        description: text("description"),
        status: researchProjectStatusEnum("status").default("draft").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
    }
);

export type ResearchProject = typeof researchProjects.$inferSelect;
export type NewResearchProject = typeof researchProjects.$inferInsert;