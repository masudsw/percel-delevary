/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { ParcelServices } from "./percel.services";
import AppError from "../../errorHelpers/AppError";

const createParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const decodeToken = req.user as JwtPayload;
        const parcelData = {
            ...req.body,
            sender: decodeToken.userId
        };
        const parcel = await ParcelServices.createParcel(decodeToken.userId, parcelData);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Parcel created successfully",
            data: parcel
        });
    }
);
const getMyPercels = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const decodeToken = req.user as JwtPayload;
        const parcels = await ParcelServices.getMyParcels(decodeToken.userId);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Parcel retrieved successfully..............",
            data: parcels
        });
    }
)
const getAllParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals?.data) {
            throw new AppError(httpStatus.NOT_FOUND, 'No parcels found');
        }
        const { results, meta } = await ParcelServices.getAllParcel(res);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Parcels retrieved successfully",
            data: results,
            meta: meta
        });

    });

const cancelParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const decodeToken = req.user as JwtPayload;
        const { trackingId } = req.params
        const parcel = await ParcelServices.cancelParcel(trackingId, decodeToken.userId)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Parcel cancelled successfully",
            data: parcel
        });
    });

const deliverParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const decodeToken = req.user as JwtPayload;
        const { trackingId } = req.params;
        const { receiverPhone } = req.body;
        console.log("phone number in controller",receiverPhone, req.body)
        try {
            const result = await ParcelServices.deliverParcel(trackingId, receiverPhone, decodeToken.userId)
            sendResponse(res, {
                success: true,
                statusCode: httpStatus.OK,
                message: "Parcel delevered successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }

    });
const inTransitParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { trackingId } = req.params;
        const decodeToken = req.user as JwtPayload;

        try {
            // 1. Await the service call
            const result = await ParcelServices.inTransitParcel(
                trackingId,
                decodeToken.userId
            );

            // 2. Only send success if no errors
            sendResponse(res, {
                success: true,
                statusCode: httpStatus.OK,
                message: "Parcel status updated to IN_TRANSIT",
                data: result
            });

        } catch (error) {
            // 3. Let catchAsync pass errors to globalErrorHandler
            next(error);
        }
    }
);
const pickParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        console.log("inside pickparcel controooler")
        const { trackingId } = req.params;
        const decodeToken = req.user as JwtPayload;
        const result = await ParcelServices.pickParcel({ trackingId, ...req.body }, decodeToken.userId)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Parcel picked successfully",
            data: result
        });
    });
const parcelStatus = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { trackingId } = req.params;
        const result = await ParcelServices.parcelStatus(trackingId)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Parcel status retrieved successfully",
            data: result
        });

    }
)
const getReceiverParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await ParcelServices.getReceiverParcel()
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Receiver parcel retrieved successfully",
            data: result
        });

    }
)

export const ParcelController = {
    createParcel,
    cancelParcel,
    getAllParcel,
    getMyPercels,
    deliverParcel,
    pickParcel,
    inTransitParcel,
    parcelStatus,
    getReceiverParcel

};