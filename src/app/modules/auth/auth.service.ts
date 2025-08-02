import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { createUserToken } from "../../utils/userToken";
import AppError from "../../errorHelpers/AppError";

const login=async(payload:Partial<IUser>)=>{
    const {email,password,userType}=payload;
    const isUserExist=await User.findOne({email})
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }
    const isPasswordMatched=await bcrypt.compare(password as string, isUserExist.password as string)
    if(!isPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST,"Incorrect password")
    }
    if(isUserExist.userType!==userType){
        throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
    }
    const userToken=createUserToken(isUserExist)
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {password:_pass, ...rest}=isUserExist
    return{
        accssToken:userToken,
        user:rest
    }
}
export const AuthServices={
    login
}