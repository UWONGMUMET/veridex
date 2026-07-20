const requiredEnv = (name: string): string => {
    const value = Bun.env[name]?.trim();
    if(!value) {
        throw new Error(
            `Missing required environment variable: ${name}`,
        );
    }
    return value;
};

export const env = {
    nodeEnv: requiredEnv("NODE_ENV"),
    host: requiredEnv("HOST"),
    port: Number(requiredEnv("PORT")),
    databaseUrl: requiredEnv("DATABASE_URL"),
    aiServiceUrl: requiredEnv("AI_SERVICE_URL"),
};