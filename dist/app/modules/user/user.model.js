"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
        type: String,
        enum: Object.values(user_interface_1.UserType),
        default: user_interface_1.UserType.SENDER
    },
    phone: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
