/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { createUserToken } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthServices } from "./auth.service";
import { envVars } from "../../config/env";



const credentialLogin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate("local", async (err: any, user: any, info: any) => {
            if (err) {
                return next(new AppError(401, err));
            }
            if (!user) {
                return next(new AppError(401, info.message));
            }


            const userToken = await createUserToken(user);
            const { password: pass, ...rest } = user.toObject();

            setAuthCookie(res, userToken);

            sendResponse(res, {
                success: true,
                statusCode: httpStatus.OK,
                message: "User logged in successfully",
                data: {
                    accessToken: userToken,
                    user: rest
                }
            });
        })(req, res, next); // 👈 IMPORTANT: Invoke the middleware
    }
);
const forgotPassword=catchAsync(
    async(req:Request, res:Response, next:NextFunction)=>{
        const {email}=req.body;
        await AuthServices.forgotPassword(email);
        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"mail send successfully",
            data:null
        })

    }
)


const logout = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false, // Consider 'true' in production for HTTPS
            sameSite: "lax",
        });

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged out successfully",
            data: null,
        });
    }
);
const googleCallbackController=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        let redirectTo=req.query.state? req.query.state as string :""
        if(redirectTo.startsWith("/")){
            redirectTo=redirectTo.slice(1)
        }
        const user=req.user;
        if(!user){
            throw new AppError(httpStatus.NOT_FOUND,"User not found")
        }
        const tokenInfo=createUserToken(user)
        setAuthCookie(res,tokenInfo)
        res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
    }
)


export const AuthController = {
    credentialLogin,
    forgotPassword,
    logout,
    googleCallbackController
}