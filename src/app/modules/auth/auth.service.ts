
import  jwt  from "jsonwebtoken"
import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import { envVars } from "../../config/env"
import { sendEmail } from "../../utils/sendEmail"


const forgotPassword=async(email:string)=>{
    const isUserExists=await User.findOne({email})
    if(!isUserExists){
        throw new AppError(httpStatus.BAD_REQUEST,"User does not exists")
    }
    if(!isUserExists.isVarified){
        throw new AppError(httpStatus.BAD_REQUEST,"User is not verified")
    }
    if(isUserExists.isBlocked){
        throw new AppError(httpStatus.BAD_REQUEST,"User is blocked")
    }
    const jwtPayload={
        userId:isUserExists._id,
        email:isUserExists.email,
        userType: isUserExists.userType
    }
    
    const resetToken=jwt.sign(jwtPayload,envVars.JWT_ACCESS_SECRET,{expiresIn:"10m"})
    const resetUILink=`${envVars.FRONTEND_URL}/reset-password?id=${isUserExists._id}&token=${resetToken}`
    sendEmail({
        to:isUserExists.email,
        subject:"Password Reset",
        templateName:"forgotPassword",
        templateData:{
            name:isUserExists.name,
            resetUILink
        }
    })
    
}

export const AuthServices = {
    
    forgotPassword,
   
}