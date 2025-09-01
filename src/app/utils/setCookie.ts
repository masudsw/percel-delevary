import { Response } from "express";
import { envVars } from "../config/env";


export const setAuthCookie=(res:Response,accessToken:string)=>{
    if(accessToken){
        res.cookie("accessToken",accessToken,{
            httpOnly:true,
            // secure:envVars.NODE_ENV==="production",
            secure:true,
            sameSite:'none',
           
        })
    }
}