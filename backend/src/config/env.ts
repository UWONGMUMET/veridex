const requiredEnv = (name: string): string => {
    const value = Bun.env[name]?.trim();
    if(!value) {
        throw new Error(
            `Missing required environment variable: ${name}`,
        );
    }
    return value;
};

const requiredNumberEnv = (name: string): number => {
    const value = Number(requiredEnv(name));
    if(!value) {
        throw new Error(
            `Environment variable ${name} must be a positive integer`
        )
    }
    return value;
}

export const env = {
    nodeEnv: requiredEnv("NODE_ENV"),
    host: requiredEnv("HOST"),
    port: Number(requiredEnv("PORT")),
    databaseUrl: requiredEnv("DATABASE_URL"),
    aiServiceUrl: requiredEnv("AI_SERVICE_URL"),
    storageRoot: requiredEnv("STORAGE_ROOT"),
    maxFileSizeBytes: requiredNumberEnv("MAX_FILE_SIZE_BYTES"),
};