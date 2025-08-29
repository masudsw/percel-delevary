import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OTPService } from "./otp.service";
import { sendResponse } from "../../utils/sendResponse";



const sendOPT=catchAsync(
    async(req:Request,res:Response)=>{
        const {email,name}=req.body
        await OTPService.sendOTP(email,name)
        sendResponse(res,{
            statusCode:200,
            success:true,
            message:"OTP send successfully",
            data:null,
        });
    }
)

const verifyOTP=catchAsync(
    async(req:Request,res:Response)=>{
        const {email,otp}=req.body

        await OTPService.verifyOTP(email,otp)
        sendResponse(res,{
            statusCode:200,
            success:true,
            message:"OTP verified successfully",
            data:null,
        });
       
    }
)

export const OTPController={
    sendOPT,
    verifyOTP
}