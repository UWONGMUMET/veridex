import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config/env";
import * as schema from "./schema";

const postgresClient = postgres(env.databaseUrl, {
    max: 10
});

export const database = drizzle(postgresClient, {
    schema,
});

export const closeDatabase = async (): Promise<void> => {
    await postgresClient.end({
        timeout: 5,
    });
};