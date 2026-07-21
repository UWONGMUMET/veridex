export type AppErrorStatus = | 400 | 404 | 409 | 422 | 500 | 502;

export class AppError extends Error {
    readonly statusCode: AppErrorStatus;
    readonly code: string;
    
    constructor(
        message: string,
        statusCode: AppErrorStatus,
        code: string,
    ) {
        super(message);
        
        this.name = new.target.name;
        this.statusCode = statusCode;
        this.code = code;
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, "NOT_FOUND");
    }
}