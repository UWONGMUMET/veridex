import { z } from "zod";

export const documentIdSchema = z.string().uuid();
export const documentProjectIdSchema = z.string().uuid();
export const allowedMimeTypes = [
    "application/pdf",
    "text/plain",
    "text/markdown"
] as const;

export const isAllowedMimeType = (mimeType: string) => {
    return allowedMimeTypes.some(
        (allowedMimeTypes) => {
            return allowedMimeTypes === mimeType
        }
    )
}