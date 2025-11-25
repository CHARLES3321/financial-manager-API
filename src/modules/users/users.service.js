import bcrypt from "bcrypt";
import { User } from "./users.model.js";
import { ConflictError, NotFoundError } from "../../common/error-definition.common.js";

const SALT_ROUNDS = 10;

export const createUser = async (userData) => {
    const existing = await User.findOne({ email: userData.email });
    if (existing) throw new ConflictError("Email already exists");

    const hashed = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const created = await User.create({ ...userData, password: hashed });
    // Remove password before returning
    const obj = created.toObject();
    delete obj.password;
    return obj;
};

export const findUserByEmail = async (email) => {
    return User.findOne({ email }).exec();
};

export const findUserById = async (id) => {
    if (!id) return null;
    return User.findById(id).exec();
};
