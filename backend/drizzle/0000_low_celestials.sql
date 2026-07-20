CREATE TYPE "public"."document_source_type" AS ENUM('upload', 'url', 'text');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('pending', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."research_project_status" AS ENUM('draft', 'ready', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."research_run_status" AS ENUM('queued', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "research_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"question" text NOT NULL,
	"description" text,
	"status" "research_project_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
