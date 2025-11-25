import express from "express";
import routes from "./modules/routes.js";
import { AppError, ValidationError } from "./common/error-definition.common.js";

export const createApp = () => {
    const app = express();

    app.use(express.json());

    // mount routes
    app.use(routes);

    // 404 handler
    app.use((req, res, next) => {
        res.status(404).json({ success: false, error: "Not Found" });
    });

    // error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        // Zod or our ValidationError may include details
        const status = err.statusCode || 500;
        const payload = {
            success: false,
            error: err.message || "Internal Server Error",
        };
        if (err.details) payload.details = err.details;
        // if AppError, use provided status
        if (!(err instanceof AppError) && process.env.NODE_ENV === "development") {
            payload.stack = err.stack;
        }
        res.status(status).json(payload);
    });

    return app;
};
