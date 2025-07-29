import { Types } from "mongoose";
interface statusLog{
    status:string,
    timestamp:Date,
    location:string,
    notes:string
}

interface IAddressFormat{
    address:string,
    district:string,
    country:string
}
interface IDimentions{
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

export interface IPercel{
    sender:Types.ObjectId;
    receiver:Types.ObjectId;
    originAddress:IAddressFormat;
    destinationAddress:IAddressFormat;
    weight:number;
    dimentions:IDimentions;
    statusLogs:statusLog[]
}