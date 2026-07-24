import { sql } from "drizzle-orm";
import { Hono } from "hono";

import { env } from "./config/env";
import { database } from "./database/client";
import { documentRoutes } from "./modules/documents/document.route";
import { indexingRoutes } from "./modules/indexing/indexing.route";
import { researchProjectRoutes } from "./modules/research-projects/research-project.route";
import { searchRoutes } from "./modules/search/search.route";
import { AppError } from "./utils/app-error";

export const app = new Hono();

app.onError((error, context) => {
    if (error instanceof AppError) {
        return context.json({
            error: {
                code: error.code,
                message: error.message
            }
        }, error.statusCode);
    }

    console.error(error);
    return context.json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong"
        }
    }, 500)
});

app.notFound((context) => {
    return context.json({
        error: {
            code: "NOT_FOUND",
            message: "Route not found",
        }
    }, 404)
});

app.get("/health", async (context) => {
    await database.execute(sql`select 1`);
    return context.json({
        status: "ok",
        service: "veridex-backend",
        database: "connected"
    });
});

app.get("/health/ai", async (context) => {
    try {
        const response = await fetch(
            `${env.aiServiceUrl}/health`,
            {
                signal: AbortSignal.timeout(5_000)
            }
        );
        if (!response.ok) {
            throw new Error(
                `AI service returned status ${response.status}`
            );
        }
        
        const result = await response.json();
        return context.json({
            status: "ok",
            ai: result,
        });
    } catch (error) {
        console.error("AI health check failed:", error);
        return context.json(
            {
                status: "degraded",
                ai: "unavailable",
            },
            503,
        );
    }
});

app.route("/api/research-projects", researchProjectRoutes);
app.route("/api", documentRoutes);
app.route("/api", indexingRoutes);
app.route("/api", searchRoutes);