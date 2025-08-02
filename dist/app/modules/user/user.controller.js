"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_services_1 = require("./user.services");
const sendResponse_1 = require("../../utils/sendResponse");
const createUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = await user_services_1.UserServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User created successfully",
        data: user
    });
});
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = await user_services_1.UserServices.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.ACCEPTED,
        message: "All users retrieved successfully",
        data: user
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.params.id;
    const payload = req.body;
    const user = await user_services_1.UserServices.updateUser(userId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.ACCEPTED,
        message: "User update successfully",
        data: user
    });
});
const userBlockUpdate = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email } = req.params;
    const user = await user_services_1.UserServices.userBlockUpdate(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.ACCEPTED,
        message: "Users block updated ",
        data: user
    });
});
exports.UserController = {
    createUser,
    getAllUsers,
    updateUser,
    userBlockUpdate
};
