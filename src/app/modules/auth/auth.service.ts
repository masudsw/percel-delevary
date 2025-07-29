import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { createUserToken } from "../../utils/userToken";


const login=async(payload:Partial<IUser>)=>{
    const {email,password}=payload;
    const isUserExist=await User.findOne({email})
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }
    const isPasswordMatched=await bcrypt.compare(password as string, isUserExist.password as string)
    if(!isPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST,"Incorrect password")
    }
    const userToken=createUserToken(isUserExist)
    const {password:pass, ...rest}=isUserExist
    return{
        accssToken:userToken.accssToken,
        user:rest
    }
}
export const AuthServices={
    login
}