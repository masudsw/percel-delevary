"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const createUser = async (payload) => {
    const { email, password } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "User already exist");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const user = await user_model_1.User.create({
        ...payload,
        password: hashedPassword,
        isBlocked: false
    });
    return user;
};
const getAllUsers = async () => {
    const users = await user_model_1.User.find({});
    const totalUsers = await user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
};
const updateUser = async (userId, payload) => {
    const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true
    });
    if (!updatedUser) {
        throw new Error('User not found');
    }
};
const userBlockUpdate = async (email) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    user.isBlocked = !user.isBlocked;
    user.save();
    return user;
};
exports.UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    userBlockUpdate
};
