"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const percel_services_1 = require("./percel.services");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const createParcel = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodeToken = req.user;
    const parcelData = {
        ...req.body,
        sender: decodeToken.userId
    };
    const parcel = await percel_services_1.ParcelServices.createParcel(decodeToken.userId, parcelData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
        data: parcel
    });
});
const getMyPercels = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodeToken = req.user;
    const parcels = await percel_services_1.ParcelServices.getMyParcels(decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel retrieved successfully",
        data: parcels
    });
});
const getAllParcel = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    if (!res.locals?.data) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'No parcels found');
    }
    const { results, meta } = await percel_services_1.ParcelServices.getAllParcel(res);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcels retrieved successfully",
        data: results,
        meta: meta
    });
});
const cancelParcel = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodeToken = req.user;
    const { trackingId } = req.params;
    const parcel = await percel_services_1.ParcelServices.cancelParcel(trackingId, decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel cancelled successfully",
        data: parcel
    });
});
const deliverParcel = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodeToken = req.user;
    const { trackingId } = req.params;
    const { phoneNumber } = req.body;
    try {
        const result = await percel_services_1.ParcelServices.deliverParcel(trackingId, phoneNumber, decodeToken.userId);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Parcel delevered successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const inTransitParcel = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { trackingId } = req.params;
    const decodeToken = req.user;
    try {
        // 1. Await the service call
        const result = await percel_services_1.ParcelServices.inTransitParcel(trackingId, decodeToken.userId);
        // 2. Only send success if no errors
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Parcel status updated to IN_TRANSIT",
            data: result
        });
    }
    catch (error) {
        // 3. Let catchAsync pass errors to globalErrorHandler
        next(error);
    }
});
const pickParcel = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { trackingId } = req.params;
    const decodeToken = req.user;
    const result = await percel_services_1.ParcelServices.pickParcel({ trackingId, ...req.body }, decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel picked successfully",
        data: result
    });
});
const parcelStatus = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { trackingId } = req.params;
    const result = await percel_services_1.ParcelServices.parcelStatus(trackingId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel status retrieved successfully",
        data: result
    });
});
exports.ParcelController = {
    createParcel,
    cancelParcel,
    getAllParcel,
    getMyPercels,
    deliverParcel,
    pickParcel,
    inTransitParcel,
    parcelStatus
};
