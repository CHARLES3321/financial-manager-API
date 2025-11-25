import dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const getEnv = (name, fallback = undefined) => {
    const v = process.env[name];
    if (v === undefined) return fallback;
    return v;
};

export const config = {
    port: Number(getEnv("PORT", 3000)),
    mongodbUri: getEnv("MONGODB_URI", ""),
    jwtSecret: getEnv("JWT_SECURITY_KEY", ""),
};
