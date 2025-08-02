"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("../user/user.interface");
exports.loginUserZodSchema = zod_1.z.object({
    email: zod_1.z
        .string({ message: "Email must be a string" })
        .min(1, "Email is required") // Required validation
        .max(100)
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address")
        .trim()
        .toLowerCase(),
    password: zod_1.z
        .string({ message: "Password must be a string" })
        .min(1, "Password is required") // Required validation
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    userType: zod_1.z.enum(Object.values(user_interface_1.UserType))
});
