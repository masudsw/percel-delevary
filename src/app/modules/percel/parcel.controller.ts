import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";

import { JwtPayload } from "jsonwebtoken";
import { ParcelServices } from "./percel.services";

const createParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error) {
      next(error);
    }
  }
);

const cancelParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodeToken = req.user as JwtPayload;
      
      
      
    //   const result = await ParcelServices.cancelParcel(
    //     // parcelId, 
    //     decodeToken.userId,
    //     decodeToken.role
    //   );
      
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel cancelled successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

const getAllParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const decodeToken = req.user as JwtPayload;
      const filters = req.query;
      
      const parcels = await ParcelServices.getAllParcel(
        decodeToken.userId,
        decodeToken.role,
        filters
      );
      
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcels retrieved successfully",
        data: parcels
      });
    } catch (error) {
      next(error);
    }
  }
);

export const ParcelController = {
  createParcel,
  cancelParcel,
  getAllParcel
};