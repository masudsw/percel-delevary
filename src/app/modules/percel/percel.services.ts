import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IParcel, IStatusLog, STATUS } from "./parcel.interface";
import { Parcel } from "./percel.model";
import httpStatus from "http-status-codes"

const generateUniqueTrackingId = () => {
    const now = new Date();
    const Year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0');
    const datePart = `${Year}${month}${day}`;
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TRK-${datePart}-${randomPart}`
}

const createParcel = async (payload: Partial<IParcel>) => {
    const trackingId = generateUniqueTrackingId();
    const statusLogs: IStatusLog[] = [{
        status: STATUS.REQUESTED,
        timestamp: new Date(),
        location: payload.originAddress?.district || 'Unknown',
        notes: 'Parcel created'
    }];

    const newPayload = {
        ...payload,
        trackingId,
        currentStatus: STATUS.REQUESTED, // Ensure status is set
        statusLogs
    };

    const percel = await Parcel.create(newPayload)
    return percel
}

const getAllParcel = async () => {
    const percels = await Parcel.find({})
    return percels
}
const getMyParcels = async (userId:string) => {
    const percels = await Parcel.find({userId}).sort({createdAt:-1})
    return percels
}

const cancelParcel = async (trackingId:string) => {
    
    const parcel = await Parcel.findOne({trackingId})
    if(!parcel){
        throw new AppError(httpStatus.BAD_REQUEST,"Percel does not exists")
    }
    if(parcel.currentStatus===STATUS.CANCELLED){
        throw new AppError(httpStatus.BAD_REQUEST,"Percel is already cancelled");
    }
    if(parcel.currentStatus===STATUS.DELIVERED){
        throw new AppError(httpStatus.BAD_REQUEST,"Percel is already delivered");
    }
    return parcel
}
const undateParcel = async (trackingId:string) => {
    const parcel = await Parcel.findOne({trackingId})
    return parcel
}
const markAsReceived=async(trackingId:string,receiverPhone:string)=>{
    const parcel=await Parcel.findOne({trackingId})
    if(!parcel){
        throw new AppError(httpStatus.BAD_REQUEST,"Incorrect tarckingId")
    }
    if(parcel.receiverPhone!=receiverPhone){
        throw new AppError(httpStatus.FORBIDDEN,"You are not authoried to receive")
    }
    if(parcel.currentStatus===STATUS.DELIVERED){
        throw new AppError(httpStatus.FORBIDDEN,"Parcel is already marked as received")
    }
    parcel.currentStatus=STATUS.DELIVERED
    parcel.statusLogs.push({
        status: STATUS.DELIVERED,
        timestamp: new Date(),
        location: parcel.destinationAddress?.district || 'Unknown',
        notes: `Received by ${parcel.receiverPhone}`
    })
    parcel.save();
    return parcel

}


export const ParcelServices = {
    createParcel,
    getMyParcels,
    getAllParcel,
    cancelParcel,
    undateParcel,
    markAsReceived
}
