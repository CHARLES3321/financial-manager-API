export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized access") {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401;
    }
}

export class NotFoundError extends Error {
    constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

export class ValidationError extends Error {
    constructor(message = "Invalid input data") {
        super(message);
        this.name = "ValidationError";
        this.statusCode = 400;
    }
}
