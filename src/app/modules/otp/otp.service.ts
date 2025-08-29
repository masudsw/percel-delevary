import { email } from "zod";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";

const OTP_EXPIRATION=2*60

const generateOtp=(length=6)=>{
    const digits='0123456789';
    let otp='';
    for(let i=0;i<length;i++){
        otp+=digits[Math.floor(Math.random()*digits.length)]
    }
    return otp;
}

const sendOTP=async(email:string, name:string)=>{
    console.log("inside opt service",email)
    const user=await User.findOne({email})
    if(!user){
        throw new AppError(httpStatus.BAD_REQUEST,"User not found");
    }
    if(user.isVarified){
        throw new AppError(httpStatus.CONFLICT, "You are already verified")
    }
    const otp=generateOtp();
    const redisKey=`otp:${email}`
    await redisClient.set(redisKey,otp,{EX:OTP_EXPIRATION})
    console.log("sending email")
    await sendEmail({
        to:email,
        subject:"Your otp code",
        templateName:"otp",
        templateData:{
            name:name,
            otp: otp
        }
    })
     
}

const verifyOTP=async(email:string, otp:string)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new AppError(404,"user not found")
    }
    if(user.isVarified){
        throw new AppError(401,"You are already verified")
    }
    const redisKey=`otp:${email}`
    const savedOtp=await redisClient.get(redisKey)
    if(!savedOtp){
        throw new AppError(401,"Invalid OTP")
    }
    if(savedOtp!==otp){
        throw new AppError(401,"Invalid OTP")
    }
    await Promise.all([
        User.updateOne({email},{isVarified:true},{runValidators:true}),
        redisClient.del([redisKey])
    ])
};
export const OTPService={
    sendOTP,
    verifyOTP
}

