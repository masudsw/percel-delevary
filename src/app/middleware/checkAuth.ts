import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes"

export const checkAuth = (...authUsers: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    console.log("auth users",authUsers)
    try {
        // const accessToken = req.cookies.accessToken;
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        console.log("inside try block....")

        if (!accessToken) {
            throw new AppError(403, "No token received")
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload
        console.log("verified token",verifiedToken)
        const isUserExist = await User.findOne({ email: verifiedToken.email })
        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
        }
        if(isUserExist.isBlocked){
            throw new AppError(httpStatus.FORBIDDEN,"You can not make any request")
        }
        if (!authUsers.includes(verifiedToken.userType)){
            throw new AppError(httpStatus.FORBIDDEN,"you are not permitted to view this route!!!")
        }
        req.user=verifiedToken
        next()

    } catch (error) {
        console.log("inside catch block")
        console.log("jwt error", error)
        next(error)
    }
}