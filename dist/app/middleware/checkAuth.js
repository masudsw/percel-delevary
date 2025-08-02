"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const checkAuth = (...authUsers) => async (req, res, next) => {
    console.log("auth users", authUsers);
    try {
        const accessToken = req.cookies.accessToken;
        console.log("inside try block....");
        if (!accessToken) {
            throw new AppError_1.default(403, "No token received");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        console.log("verified token", verifiedToken);
        const isUserExist = await user_model_1.User.findOne({ email: verifiedToken.email });
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
        }
        if (isUserExist.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You can not make any request");
        }
        if (!authUsers.includes(verifiedToken.userType)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "you are not permitted to view this route!!!");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log("inside catch block");
        console.log("jwt error", error);
        next(error);
    }
};
exports.checkAuth = checkAuth;
