"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const addressSchema = new mongoose_1.Schema({
    address: { type: String, required: true },
    district: { type: String, required: true },
    country: { type: String, required: true }
}, { _id: false });
const dimensionSchema = new mongoose_1.Schema({
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    length: { type: Number, required: true }
}, { _id: false });
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.STATUS),
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    location: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    }
}, { _id: false });
const parcelSchema = new mongoose_1.Schema({
    trackingId: { type: String, unique: true, required: true },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    originAddress: {
        type: addressSchema,
        required: true
    },
    destinationAddress: {
        type: addressSchema,
        required: true
    },
    dimentions: {
        type: dimensionSchema,
        required: true
    },
    weight: {
        type: Number, required: true
    },
    statusLogs: {
        type: [statusLogSchema],
        default: []
    },
    description: {
        type: String,
        required: true
    },
    shippingFee: {
        type: Number
    },
    estimatedDeliveryDate: {
        type: Date
    },
    currentStatus: {
        type: String,
        enum: Object.values(parcel_interface_1.STATUS),
        default: parcel_interface_1.STATUS.REQUESTED
    }
}, { timestamps: true });
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
