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

const createParcel = async (payload: Partial<IParcel>) => {
    const trackingId = generateUniqueTrackingId();

    const newPayload={trackingId, ...payload}

    const percel = await Parcel.create(newPayload)
    return percel
}
const getAllParcel = async (payload: Partial<IParcel>) => {
    const trackingId = generateUniqueTrackingId();
    console.log(payload)
    const newPayload = { trackingId, ...payload }
    const percel = await Parcel.create(newPayload)
    return percel
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
