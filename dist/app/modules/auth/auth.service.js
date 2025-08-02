"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userToken_1 = require("../../utils/userToken");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const login = async (payload) => {
    const { email, password, userType } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Email does not exist");
    }
    const isPasswordMatched = await bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Incorrect password");
    }
    if (isUserExist.userType !== userType) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    const userToken = (0, userToken_1.createUserToken)(isUserExist);
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password: _pass, ...rest } = isUserExist;
    return {
        accssToken: userToken,
        user: rest
    };
};
exports.AuthServices = {
    login
};
