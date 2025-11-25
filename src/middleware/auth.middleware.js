import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import { UnauthorizedError } from "../error-definition.common.js";
import { findUserById } from "../../modules/users/users.service.js";

export const checkToken = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            throw new UnauthorizedError("Authorization header missing");
        }

        const token = header.split(" ")[1];
        let payload;
        try {
            payload = jwt.verify(token, config.jwtSecret);
        } catch (err) {
            throw new UnauthorizedError("Invalid or expired token");
        }

        const user = await findUserById(payload.userId);
        if (!user) throw new UnauthorizedError("User from token not found");

        // attach minimal user info
        req.user = { id: user._id, email: user.email, name: user.name };
        next();
    } catch (err) {
        next(err);
    }
};
