import { z } from "zod";

export const createTransactionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    amount: z.number().min(0.01, "Amount must be at least 0.01"),
    type: z.enum(["income", "expense"]),
    category: z.string().optional(),
    date: z.string().optional(), // expect ISO date string; will parse in controller/service if provided
});

export const updateTransactionSchema = z.object({
    title: z.string().min(1).optional(),
    amount: z.number().min(0.01).optional(),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().optional(),
    date: z.string().optional(),
});
