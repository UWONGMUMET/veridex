CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"research_project_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"source_type" "document_source_type" NOT NULL,
	"source_url" text,
	"storage_key" text,
	"parsed_storage_key" text,
	"mime_type" varchar(100),
	"file_size" integer,
	"page_count" integer,
	"character_count" integer,
	"status" "document_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_research_project_id_research_projects_id_fk" FOREIGN KEY ("research_project_id") REFERENCES "public"."research_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "documents_project_id_idx" ON "documents" USING btree ("research_project_id");