"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const parcel_interface_1 = require("./parcel.interface");
const percel_model_1 = require("./percel.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const percelStateCheck_1 = require("../../utils/percelStateCheck");
const generateUniqueTrackingId = () => {
    const now = new Date();
    const Year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const datePart = `${Year}${month}${day}`;
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TRK-${datePart}-${randomPart}`;
};
const createParcel = async (userId, payload) => {
    const isUserExist = await user_model_1.User.findById({ _id: userId });
    if (isUserExist?.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Sorry you are blocked. Contact with support to request for sending parcel");
    }
    const trackingId = generateUniqueTrackingId();
    const statusLogs = [{
            status: parcel_interface_1.STATUS.REQUESTED,
            timestamp: new Date(),
            location: payload.originAddress?.district || 'Unknown',
            notes: 'Parcel created'
        }];
    const { receiverPhone, originAddress, destinationAddress, weight } = payload;
    // 1. Validate required fields (avoid 'undefined' errors)
    if (!receiverPhone || !originAddress || !destinationAddress || weight == null) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Missing required fields!");
    }
    const existingParcel = await percel_model_1.Parcel.findOne({
        receiverPhone,
        "originAddress.address": originAddress.address,
        "destinationAddress.address": destinationAddress.address,
        weight,
    });
    if (existingParcel) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Duplicate parcel entry detected!");
    }
    const newPayload = {
        ...payload,
        trackingId,
        currentStatus: parcel_interface_1.STATUS.REQUESTED, // Ensure status is set
        statusLogs,
        shippingFee: undefined,
        estimatedDeliveryDate: undefined
    };
    const percel = await percel_model_1.Parcel.create(newPayload);
    return percel;
};
const getAllParcel = async (res) => {
    const { results, meta } = res.locals.data;
    return {
        results,
        meta
    };
};
const getMyParcels = async (userId) => {
    const percels = await percel_model_1.Parcel.find({ sender: userId }).sort({ createdAt: -1 });
    return percels;
};
const pickParcel = async (updateData, userId) => {
    const { trackingId, shippingFee, notes, estimatedDeliveryDate, ...updates } = updateData;
    const [parcel, user] = await Promise.all([
        percel_model_1.Parcel.findOne({ trackingId }),
        user_model_1.User.findById(userId)
    ]);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not found");
    }
    (0, percelStateCheck_1.validateStatusTransition)(parcel, parcel_interface_1.STATUS.PICKED, user);
    const statusUpdate = {
        status: parcel_interface_1.STATUS.PICKED,
        timestamp: new Date(),
        location: parcel.originAddress?.district || 'Unknown', // Typically picked from origin
        notes: `Picked by ${user.name} (${user.userType}): ${notes}`,
    };
    const updatedParcel = await percel_model_1.Parcel.findOneAndUpdate({ trackingId }, {
        ...updates,
        shippingFee,
        estimatedDeliveryDate,
        currentStatus: parcel_interface_1.STATUS.PICKED,
        $push: { statusLogs: statusUpdate }
    }, {
        new: true,
        runValidators: true
    });
    return updatedParcel;
};
const inTransitParcel = async (trackingId, userId) => {
    const [parcel, user] = await Promise.all([
        percel_model_1.Parcel.findOne({ trackingId }),
        user_model_1.User.findById(userId)
    ]);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not found");
    }
    (0, percelStateCheck_1.validateStatusTransition)(parcel, parcel_interface_1.STATUS.IN_TRANSIT, user);
    // Prepare status log entry
    const statusUpdate = {
        status: parcel_interface_1.STATUS.IN_TRANSIT,
        timestamp: new Date(),
        location: parcel.destinationAddress?.district || "Unknown",
        notes: `Marked in-transit by ${user.name} (${user.userType === "ADMIN" ? "Admin" : "User"})`
    };
    // Single atomic update operation
    const updatedParcel = await percel_model_1.Parcel.findOneAndUpdate({ trackingId }, {
        currentStatus: parcel_interface_1.STATUS.IN_TRANSIT,
        $push: { statusLogs: statusUpdate }
    }, { new: true, runValidators: true });
    return updatedParcel;
};
const deliverParcel = async (trackingId, receiverPhone, userId) => {
    const [parcel, user] = await Promise.all([
        percel_model_1.Parcel.findOne({ trackingId }),
        user_model_1.User.findById(userId)
    ]);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (parcel.receiverPhone !== receiverPhone) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to receive this parcel");
    }
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    (0, percelStateCheck_1.validateStatusTransition)(parcel, parcel_interface_1.STATUS.DELIVERED, user);
    const statusUpdate = {
        status: parcel_interface_1.STATUS.DELIVERED,
        timestamp: new Date(),
        location: parcel.destinationAddress?.district || 'Unknown',
        notes: userId
            ? `Delivered by ${user?.name} (${user?.userType}) to ${receiverPhone}`
            : `Received by customer (${receiverPhone})`
    };
    // Atomic update operation
    const updatedParcel = await percel_model_1.Parcel.findOneAndUpdate({ trackingId }, {
        currentStatus: parcel_interface_1.STATUS.DELIVERED,
        $push: { statusLogs: statusUpdate },
        deliveredAt: new Date() // Add delivery timestamp
    }, {
        new: true,
        runValidators: true
    });
    return updatedParcel;
};
const cancelParcel = async (trackingId, userId) => {
    const parcel = await percel_model_1.Parcel.findOne({ trackingId });
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Percel does not exists");
    }
    if (parcel.currentStatus === parcel_interface_1.STATUS.CANCELLED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Percel is already cancelled");
    }
    const isUserExist = await user_model_1.User.findById({ _id: userId });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authoried");
    }
    if (parcel.currentStatus !== parcel_interface_1.STATUS.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Sorry, the percel is already ${parcel.currentStatus}`);
    }
    parcel.currentStatus = parcel_interface_1.STATUS.CANCELLED;
    parcel.save();
    return parcel;
};
const parcelStatus = async (trackingId) => {
    const parcel = await percel_model_1.Parcel.findOne({ trackingId });
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Percel does not exists");
    }
    return parcel.statusLogs;
};
exports.ParcelServices = {
    createParcel,
    getMyParcels,
    getAllParcel,
    cancelParcel,
    pickParcel,
    inTransitParcel,
    deliverParcel,
    parcelStatus
};
