import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { ParcelServices } from "./percel.services";

const createParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const decodeToken = req.user as JwtPayload;

        // Add sender ID from the authenticated user
        const parcelData = {
            ...req.body,
            sender: decodeToken.userId // Assuming your JWT payload has userId
        };
        const parcel = await ParcelServices.createParcel(parcelData);
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
            statusCode: httpStatus.CREATED,
            message: "Parcel created successfully",
            data: parcels
        });
    }
)
const getAllParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const parcels = await ParcelServices.getAllParcel();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Parcels retrieved successfully",
            data: parcels
        });

    });

const cancelParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { trackingId } = req.body
        const parcel = await ParcelServices.cancelParcel(trackingId)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Parcel cancelled successfully",
            data: parcel
        });
    });

const markAsReceived = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { trackingId } = req.params;
        console.log(req.body)
        const { phoneNumber } = req.body;
        try {
            const result = await ParcelServices.markAsReceived(trackingId, phoneNumber)
            sendResponse(res, {
                success: true,
                statusCode: httpStatus.OK,
                message: "Parcel delevered successfully",
                data: result
            });
        } catch (error) {
            // 3. Let catchAsync pass errors to globalErrorHandler
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


export const ParcelController = {
    createParcel,
    cancelParcel,
    getAllParcel,
    getMyPercels,
    markAsReceived,
    pickParcel,
    inTransitParcel,
    parcelStatus

};