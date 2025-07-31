import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { Request,Response,NextFunction } from "express"
import httpStatus from "http-status-codes"
import { ParcelServices } from "./percel.services"
import { JwtPayload } from "jsonwebtoken"


const createParcel=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        const decodeToken=req.user as JwtPayload
        console.log("create parcel",decodeToken)
        
        // const percel=await ParcelServices.createParcel(req.body)
        
        sendResponse(res,{
            success:true,
            statusCode:httpStatus.CREATED,
            message:"Parcel created successfully",
            data:percel
        })
    }
)
const cancelParcel=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{

    }
)
const getAllParcel=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        //verify token verify user -authorized user

    }
)

export const ParcelController={
    createParcel,
    cancelParcel,
    getAllParcel
}