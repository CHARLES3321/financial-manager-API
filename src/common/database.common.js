import mongoose from "mongoose";

export const connectToDatabase = async (dbURL) => {
    try {
        await mongoose.connect(dbURL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(" MongoDB connection failed:", error.message);
        process.exit(1); // stop server if DB fails
    }
};
