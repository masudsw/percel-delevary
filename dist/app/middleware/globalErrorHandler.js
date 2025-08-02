"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/*eslint-disable  @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const handleZodError_1 = require("../helpers/handleZodError");
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    // Default error response structure
    let statusCode = 500;
    let message = "Something went wrong!!";
    let errorSources = [];
    const stack = env_1.envVars.NODE_ENV === "development" ? err.stack : undefined;
    // Development logging
    if (env_1.envVars.NODE_ENV === "development") {
        console.error("ERROR:", err);
    }
    // Handle different error types
    if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error";
        errorSources = Object.values(err.errors).map((val) => ({
            path: val.path,
            message: val.message,
        }));
    }
    else if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
        errorSources = [{
                path: field,
                message: `Duplicate value for ${field}`,
            }];
    }
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    // Final error response
    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack, // Only in development
        ...(env_1.envVars.NODE_ENV === "production" && { stack: undefined }),
    });
};
exports.globalErrorHandler = globalErrorHandler;
