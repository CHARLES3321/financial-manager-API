import { ValidationError as ZodValidationError } from "zod";
import { registerUser, loginUser } from "./auth.service.js";
import { registerUserSchema, loginUserSchema } from "./auth.schema.js";
import { ValidationError } from "../../common/error-definition.common.js";

export const register = async (req, res, next) => {
    try {
        const parsed = registerUserSchema.parse(req.body);
        const result = await registerUser(parsed);
        return res.status(201).json({ success: true, data: { user: result.user, token: result.token } });
    } catch (err) {
        if (err instanceof ZodValidationError) {
            return next(new ValidationError("Validation error", err.errors));
        }
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const parsed = loginUserSchema.parse(req.body);
        const result = await loginUser(parsed.email, parsed.password);
        return res.status(200).json({ success: true, data: { user: result.user, token: result.token } });
    } catch (err) {
        if (err instanceof ZodValidationError) {
            return next(new ValidationError("Validation error", err.errors));
        }
        next(err);
    }
};
