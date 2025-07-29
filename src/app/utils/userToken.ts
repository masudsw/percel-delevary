
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";
import { envVars } from "../config/env";

export const createUserToken=(user:Partial<IUser>)=>{
    const jwtPayload={
        userId:user._id,
        email:user.email,
        userType:user.userType   
    }
    const accssToken=generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
    return accssToken
}