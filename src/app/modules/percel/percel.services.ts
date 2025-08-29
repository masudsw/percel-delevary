
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IAddressFormat, IParcel, IStatusLog, STATUS } from "./parcel.interface";
import { Parcel } from "./percel.model";
import httpStatus from "http-status-codes"
import { Response } from "express";
import { validateStatusTransition } from "../../utils/percelStateCheck";
import mongoose from "mongoose";

const generateUniqueTrackingId = () => {
    const now = new Date();
    const Year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0');
    const datePart = `${Year}${month}${day}`;
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TRK-${datePart}-${randomPart}`
}

const createParcel = async (userId: string, payload: Partial<IParcel>) => {
    const isUserExist = await User.findById({ _id: userId })
    if (isUserExist?.isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, "Sorry you are blocked. Contact with support to request for sending parcel")
    }
    const trackingId = generateUniqueTrackingId();
    const statusLogs: IStatusLog[] = [{
        status: STATUS.REQUESTED,
        timestamp: new Date(),
        location: payload.originAddress?.district || 'Unknown',
        notes: 'Parcel created'
    }];
    const { receiverPhone, originAddress, destinationAddress, weight } = payload
    // 1. Validate required fields (avoid 'undefined' errors)

    if (!receiverPhone || !originAddress || !destinationAddress || weight == null) {
        throw new AppError(httpStatus.BAD_REQUEST, "Missing required fields!");
    }
    const existingParcel = await Parcel.findOne({
        receiverPhone,
        "originAddress.address": originAddress.address,
        "destinationAddress.address": destinationAddress.address,
        weight,
    });


    if (existingParcel) {
        throw new AppError(httpStatus.CONFLICT, "Duplicate parcel entry detected!");
    }

    const newPayload = {
        ...payload,
        trackingId,
        currentStatus: STATUS.REQUESTED, // Ensure status is set
        statusLogs,
        shippingFee: undefined,
        estimatedDeliveryDate: undefined
    };

    const percel = await Parcel.create(newPayload)
    return percel
}

const getAllParcel = async (res: Response) => {
    const { results, meta } = res.locals.data;
    return {
        results,
        meta
    }
}
const getMyParcels = async (userId: string) => {
    if(!userId){
        throw new AppError(httpStatus.NOT_FOUND,"User not found")
    }
    const senderId = new mongoose.Types.ObjectId(userId);
    const parcels = await Parcel.find({ sender: senderId }).sort({ createdAt: -1 })
    return parcels
}
const pickParcel = async (
    updateData: {
        trackingId: string;
        receiverName?: string;
        receiverPhone?: string;
        destinationAddress?: IAddressFormat;
        estimatedDeliveryDate?: Date;
        weight?: number;
        shippingFee: number;
        notes: string;
    },
    userId: string
) => {
    const { trackingId, shippingFee, notes, estimatedDeliveryDate, ...updates } = updateData;

    
    const [parcel, user] = await Promise.all([
        Parcel.findOne({ trackingId }),
        User.findById(userId)
    ]);

    
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }

    
    validateStatusTransition(
        parcel,
        STATUS.PICKED,  
        user            
    );


    const statusUpdate = {
        status: STATUS.PICKED,
        timestamp: new Date(),
        location: parcel.originAddress?.district || 'Unknown', // Typically picked from origin
        notes: `Picked by ${user.name} (${user.userType}): ${notes}`,
    };

    
    const updatedParcel = await Parcel.findOneAndUpdate(
        { trackingId },
        {
            ...updates,
            shippingFee,
            estimatedDeliveryDate,
            currentStatus: STATUS.PICKED,
            $push: { statusLogs: statusUpdate }
        },
        { 
            new: true, 
            runValidators: true 
        }
    );

    return updatedParcel;
};

const inTransitParcel = async (trackingId: string, userId: string) => {
    const [parcel, user] = await Promise.all([
        Parcel.findOne({ trackingId }),
        User.findById(userId)
    ]);

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }

    
    validateStatusTransition(
        parcel,
        STATUS.IN_TRANSIT, 
        user              
    );

    // Prepare status log entry
    const statusUpdate = {
        status: STATUS.IN_TRANSIT,
        timestamp: new Date(),
        location: parcel.destinationAddress?.district || "Unknown",
        notes: `Marked in-transit by ${user.name} (${user.userType === "ADMIN" ? "Admin" : "User"})`
    };

    // Single atomic update operation
    const updatedParcel = await Parcel.findOneAndUpdate(
        { trackingId },
        {
            currentStatus: STATUS.IN_TRANSIT,
            $push: { statusLogs: statusUpdate }
        },
        { new: true, runValidators: true }
    );

    return updatedParcel;
};

const deliverParcel = async (trackingId: string, receiverPhone: string, userId?: string) => {
    const [parcel, user] = await Promise.all([
        Parcel.findOne({ trackingId }),
        User.findById(userId)
    ]);

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }
    console.log("parcel.receiverPhone",parcel.receiverPhone)
    console.log("receiverPhone",receiverPhone)
    if (parcel.receiverPhone !== receiverPhone) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to receive this parcel");
    }

    if(!user){
        throw new AppError(httpStatus.BAD_REQUEST,"User not found")
    }
    validateStatusTransition(
        parcel,
        STATUS.DELIVERED,
        user
    );

    const statusUpdate = {
        status: STATUS.DELIVERED,
        timestamp: new Date(),
        location: parcel.destinationAddress?.district || 'Unknown',
        notes: userId 
            ? `Delivered by ${user?.name} (${user?.userType}) to ${receiverPhone}`
            : `Received by customer (${receiverPhone})`
    };

    // Atomic update operation
    const updatedParcel = await Parcel.findOneAndUpdate(
        { trackingId },
        {
            currentStatus: STATUS.DELIVERED,
            $push: { statusLogs: statusUpdate },
            deliveredAt: new Date() // Add delivery timestamp
        },
        { 
            new: true,
            runValidators: true 
        }
    );

    return updatedParcel;
};
const cancelParcel = async (trackingId: string, userId: string) => {

    const parcel = await Parcel.findOne({ trackingId })
    if (!parcel) {
        throw new AppError(httpStatus.BAD_REQUEST, "Percel does not exists")
    }
    if (parcel.currentStatus === STATUS.CANCELLED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Percel is already cancelled");
    }
    const isUserExist = await User.findById({ _id: userId })
    if (!isUserExist) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authoried");
    }
    if (parcel.currentStatus !== STATUS.REQUESTED) {
        throw new AppError(httpStatus.BAD_REQUEST, `Sorry, the percel is already ${parcel.currentStatus}`)
    }
    parcel.currentStatus = STATUS.CANCELLED
    parcel.save();
    return parcel
}

const parcelStatus = async (trackingId: string) => {

    const parcel = await Parcel.findOne({ trackingId })
    if (!parcel) {
        throw new AppError(httpStatus.BAD_REQUEST, "Percel does not exists")
    }
    return parcel.statusLogs

}
const getReceiverParcel=async()=>{
    const parcels=await Parcel.find({currentStatus:STATUS.IN_TRANSIT})
    if(!parcels){
        throw new AppError(httpStatus.BAD_REQUEST,"Parcels does not exists")
    }
    return parcels
}


export const ParcelServices = {
    createParcel,
    getMyParcels,
    getAllParcel,
    cancelParcel,
    pickParcel,
    inTransitParcel,
    deliverParcel,
    parcelStatus,
    getReceiverParcel
}
