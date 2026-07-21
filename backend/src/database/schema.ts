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

export const documents = pgTable(
    "documents",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        researchProjectId: uuid("research_project_id").notNull().references(() => researchProjects.id, {
            onDelete: "cascade",
        }),
        name: varchar("name", { length: 255 }).notNull(),
        sourceType: documentSourceTypeEnum("source_type").notNull(),
        sourceUrl: text("source_url"),
        storageKey: text("storage_key"),
        parsedStorageKey: text("parsed_storage_key"),
        mimeType: varchar("mime_type", { length: 100 }),
        fileSize: integer("file_size"),
        pageCount: integer("page_count"),
        characterCount: integer("character_count"),
        status: documentStatusEnum("status").default("pending").notNull(),
        errorMessage: text("error_message"),
        createdAt: timestamp("created_at", { withTimezone:true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone:true }).defaultNow().notNull()
    }, (table) => [
        index(
            "documents_project_id_idx",
        ).on(
            table.researchProjectId
        )
    ]
)

export type ResearchProject = typeof researchProjects.$inferSelect;
export type NewResearchProject = typeof researchProjects.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;