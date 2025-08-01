import { Types } from "mongoose";
export interface IStatusLog{
    status:STATUS
    timestamp:Date,
    location:string,
    notes:string
}

export interface IAddressFormat{
    address:string,
    district:string,
    country:string
}
export interface IDimentions{
    length:number;
    width:number;
    height:number;
}
export enum STATUS{
    REQUESTED="REQUESTED",
    PICKED="PICKED",
    IN_TRANSIT="IN_TRANSIT",
    DELIVERED="DELIVERED",
    CANCELLED="CANCELLED",
    
}

export interface IParcel{
    trackingId:string,
    sender:Types.ObjectId;
    receiverName:string;
    receiverPhone:string;
    originAddress:IAddressFormat;
    destinationAddress:IAddressFormat;
    description:string,
    shippingFee:number,
    estimatedDeliveryDate:Date,
    currentStatus:STATUS,
    weight:number;
    dimentions:IDimentions;
    statusLogs:IStatusLog[]
}