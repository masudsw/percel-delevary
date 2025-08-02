"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStatusTransition = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const statusFlow_1 = require("./statusFlow");
// parcelUtils.ts
const validateStatusTransition = (parcel, newStatus, user) => {
    const lastStatus = parcel.statusLogs.slice(-1)[0]?.status || undefined;
    // Block ALL duplicate statuses (even for admins)
    if (lastStatus === newStatus) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Parcel is already in ${newStatus} status`);
    }
    // Allow admin cancellation from any state
    if (newStatus === 'CANCELLED' && user.userType === 'ADMIN') {
        return; // Skip further validation
    }
    // Apply standard flow rules for all other cases
    if (!lastStatus || !statusFlow_1.STATUS_FLOW[lastStatus].includes(newStatus)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot change status from ${lastStatus} to ${newStatus}`);
    }
};
exports.validateStatusTransition = validateStatusTransition;
