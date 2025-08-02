/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { setAuthCookie } from "../../utils/setCookie";


const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const loginInfo = await AuthServices.login(req.body)
        setAuthCookie(res, loginInfo.accssToken)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User login successful",
            data: loginInfo
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


export const AuthController = {
    login,
    logout
}