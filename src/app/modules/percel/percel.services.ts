import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IParcel, STATUS } from "./parcel.interface";
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

const createParcel = async (senderId: string, payload: Partial<IParcel>) => {
    const trackingId = generateUniqueTrackingId();
    const isUser=await User.find({_id:senderId})
    if(!isUser){
        throw new AppError(httpStatus.NOT_FOUND,"User not found")
    }

    const newPercel = {
        ...payload,
        sender: senderId,
        trackingId,
        currentStatus: STATUS.REQUESTED,
        statusLogs: [{
            status: STATUS.REQUESTED,
            timestamp: new Date(),
            location: payload?.location,
            notes: payload?.statusLogs.notes

        }]



    }


    const user = await Parcel.create()
    return user
}
const getAllParcel = async (payload: Partial<IParcel>) => {
    const trackingId = generateUniqueTrackingId();

    console.log(payload)


    const user = await Parcel.create()
    return user
}

const cancelParcel = async (payload: Partial<IParcel>) => {
    const trackingId = generateUniqueTrackingId();
    console.log(payload)
    const user = await Parcel.create()
    return user
}

const undateParcel = async (payload: Partial<IParcel>) => {
    //different property will be updated by different
    const trackingId = generateUniqueTrackingId();
    console.log(payload)
    const user = await Parcel.create()
    return user
}


export const ParcelServices = {
    createParcel,
    getAllParcel,
    cancelParcel,
    undateParcel
}
