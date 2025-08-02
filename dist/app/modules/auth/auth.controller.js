"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const setCookie_1 = require("../../utils/setCookie");
const login = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const loginInfo = await auth_service_1.AuthServices.login(req.body);
    (0, setCookie_1.setAuthCookie)(res, loginInfo.accssToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User login successful",
        data: loginInfo
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false, // Consider 'true' in production for HTTPS
        sameSite: "lax",
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User logged out successfully",
        data: null,
    });
});
exports.AuthController = {
    login,
    logout
};
