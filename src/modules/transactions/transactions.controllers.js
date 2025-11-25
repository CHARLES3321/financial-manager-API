import { ValidationError as ZodValidationError } from "zod";
import {
    getTransactionsByUserId,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isTransactionOwner,
} from "./transactions.service.js";
import { createTransactionSchema, updateTransactionSchema } from "./transactions.schema.js";
import { NotFoundError, ValidationError, UnauthorizedError } from "../../common/error-definition.common.js";

export const getAllTransactions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const items = await getTransactionsByUserId(userId);
        return res.status(200).json({ success: true, data: items });
    } catch (err) {
        next(err);
    }
};

export const getTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const tx = await getTransactionById(id);
        if (!tx) throw new NotFoundError("Transaction not found");
        if (tx.userId.toString() !== userId.toString()) throw new UnauthorizedError("Not authorized");
        return res.status(200).json({ success: true, data: tx });
    } catch (err) {
        next(err);
    }
};

export const createNewTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // parse body; zod expects amount number -> convert if string
        const parsed = createTransactionSchema.parse(req.body);

        // if date provided and is string, convert to Date
        const payload = { ...parsed };
        if (payload.date) payload.date = new Date(payload.date);

        const created = await createTransaction(payload, userId);
        return res.status(201).json({ success: true, data: created });
    } catch (err) {
        if (err instanceof ZodValidationError) {
            return next(new ValidationError("Validation error", err.errors));
        }
        next(err);
    }
};

export const updateExistingTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const tx = await getTransactionById(id);
        if (!tx) throw new NotFoundError("Transaction not found");
        if (tx.userId.toString() !== userId.toString()) throw new UnauthorizedError("Not authorized");

        const parsed = updateTransactionSchema.parse(req.body);
        const payload = { ...parsed };
        if (payload.date) payload.date = new Date(payload.date);

        const updated = await updateTransaction(id, payload);
        return res.status(200).json({ success: true, data: updated });
    } catch (err) {
        if (err instanceof ZodValidationError) {
            return next(new ValidationError("Validation error", err.errors));
        }
        next(err);
    }
};

export const deleteTransactionById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const tx = await getTransactionById(id);
        if (!tx) throw new NotFoundError("Transaction not found");
        if (tx.userId.toString() !== userId.toString()) throw new UnauthorizedError("Not authorized");

        await deleteTransaction(id);
        return res.status(200).json({ success: true, data: null, message: "Transaction deleted" });
    } catch (err) {
        next(err);
    }
};
