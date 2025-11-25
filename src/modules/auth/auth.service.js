import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../../config/config.js";
import { createUser, findUserByEmail } from "../users/users.service.js";
import { UnauthorizedError } from "../../common/error-definition.common.js";

const signToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: "7d" });
};

export const registerUser = async (userData) => {
    // createUser will hash password and check duplicates
    const user = await createUser(userData);
    const token = signToken(user._id);
    return { user, token };
};

export const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedError("Invalid credentials");

    // remove password before returning
    const u = user.toObject();
    delete u.password;
    const token = signToken(u._id);
    return { user: u, token };
};
