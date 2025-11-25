import express from "express";
import * as authControllers from "./auth/auth.controllers.js";
import * as transactionsControllers from "./transactions/transactions.controllers.js";
import { checkToken } from "../common/middleware/auth.middleware.js";

const router = express.Router();

// auth
router.post("/api/auth/register", authControllers.register);
router.post("/api/auth/login", authControllers.login);

// transactions (protected)
router.get("/api/transactions", checkToken, transactionsControllers.getAllTransactions);
router.get("/api/transactions/:id", checkToken, transactionsControllers.getTransaction);
router.post("/api/transactions", checkToken, transactionsControllers.createNewTransaction);
router.put("/api/transactions/:id", checkToken, transactionsControllers.updateExistingTransaction);
router.delete("/api/transactions/:id", checkToken, transactionsControllers.deleteTransactionById);

export default router;
