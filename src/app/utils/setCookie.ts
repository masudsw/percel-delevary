import { Response } from "express";

export const setAuthCookie=(res:Response,accessToken:string)=>{
    if(accessToken){
        res.cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:false
        })
    }
}