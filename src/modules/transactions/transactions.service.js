import { Transaction } from "./transactions.model.js";
import { NotFoundError } from "../../common/error-definition.common.js";

export const getTransactionsByUserId = async (userId) => {
    return Transaction.find({ userId }).sort({ date: -1 }).exec();
};

export const getTransactionById = async (transactionId) => {
    return Transaction.findById(transactionId).exec();
};

export const createTransaction = async (transactionData, userId) => {
    const doc = await Transaction.create({ ...transactionData, userId });
    return doc.toObject();
};

export const updateTransaction = async (transactionId, updateData) => {
    const updated = await Transaction.findByIdAndUpdate(transactionId, updateData, {
        new: true,
        runValidators: true,
    }).exec();
    if (!updated) throw new NotFoundError("Transaction not found");
    return updated.toObject();
};

export const deleteTransaction = async (transactionId) => {
    const deleted = await Transaction.findByIdAndDelete(transactionId).exec();
    if (!deleted) throw new NotFoundError("Transaction not found");
    return deleted.toObject();
};

export const isTransactionOwner = async (transactionId, userId) => {
    const tx = await Transaction.findById(transactionId).exec();
    if (!tx) return false;
    return tx.userId.toString() === userId.toString();
};
