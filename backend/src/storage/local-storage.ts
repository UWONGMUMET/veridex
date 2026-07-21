import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";

import { env } from "../config/env";

const storageRoot = resolve(env.storageRoot);

const resolveStorageKey = (key: string): string => {
    const filePath = resolve(storageRoot, key);
    const isInsideStorage =
        filePath === storageRoot ||
        filePath.startsWith(`${storageRoot}${sep}`);

    if (!isInsideStorage) {
        throw new Error("Invalid storage key");
    }

    return filePath;
};

type WriteStoredFileInput = {
    key: string;
    data: Uint8Array;
};

export const writeStoredFile = async (
    input: WriteStoredFileInput,
): Promise<void> => {
    const filePath = resolveStorageKey(input.key);

    await mkdir(dirname(filePath), {
        recursive: true,
    });

    await writeFile(filePath, input.data);
};

export const readStoredText = async (key: string): Promise<string> => {
    const filePath = resolveStorageKey(key);

    return readFile(filePath, "utf-8");
};

export const deleteStoredFile = async (key: string): Promise<void> => {
    const filePath = resolveStorageKey(key);

    try {
        await unlink(filePath);
    } catch (error) {
        const fileError = error as NodeJS.ErrnoException;

        if (fileError.code === "ENOENT") {
            return;
        }

        throw error;
    }
};
